// SERVIÇO RESPONSÁVEL PELA CRIAÇÃO DE AGENDAMENTOS
import IAppointmentsRepository from '@modules/appointments/repositories/IApointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import AppError from '@shared/errors/AppError';
import { format, getHours, isBefore, startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IResponseDTO {
  provider_id: string;
  user_id: string;
  date: Date;
}

// Nessa classe será contida toda a logica de criação de um agendamento
@injectable()
class CreateAppointmentService {
  /* O constructor vai receber por parâmetro qual é o repositório
  que será utilizado pelo service
  -> Isso faz com que o service não dependa diretamente do repository
  do typeorm, mas sim de uma interface (interface de IAppointmentsRepository) */
  constructor(
      @inject('AppointmentsRepository')
      private appointmentsRepository: IAppointmentsRepository,

      @inject('NotificationsRepository')
      private notificationsRepository: INotificationsRepository,

      @inject('CacheProvider')
      private cacheProvider: ICacheProvider,
    ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IResponseDTO): Promise<Appointment> {
    /* startOfHour -> É uma regra de negócio pois a mesma só permite
    criar agendamento de hora em hora (tem uma logistica por trás) */
    const appointmentDate = startOfHour(date);

    //Evitando que agendamentos sejam realizados no passado
    if(isBefore(appointmentDate, Date.now())){
      throw new AppError("you can't create an appointment on a past date.");
    }

    //Um usuário não pode criar um agendamento com ele mesmo
    if(user_id === provider_id) {
      throw new AppError("you can't create an appointment with yourself.");
    }

    //Um usuário não pode criar um agendamento antes das 8hrs e depois das 17hrs
    if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError("you can only create appointments between 8am and 5pm.");
    }

    // Verificando se existem agendamentos na mesma data e hora:
    const findAppointmentInTheSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    // Se houver agendamento na mesma data e hora retorna um erro:
    if (findAppointmentInTheSameDate) {
      throw new AppError('This appointment is already boked.');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    //Formatando data:
    //Devo ir na documentação do date-fns para saber o formato que quero na data.
    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");
    //Enviando notificação do agendamento criado para prestador do serviço:
    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
     });

    //  console.log(`provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`)

     //Invalidando no cache
     await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`
     );

    return appointment;
  }
}

export default CreateAppointmentService;

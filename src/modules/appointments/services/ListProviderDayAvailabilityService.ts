import { getHours, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import IAppointmentsRepository from '../repositories/IApointmentsRepository';

/* SERVICE RESPONSÁVEL POR LISTAR A DISPONIBILIDADE DE HORARIOS DISPONÍVEIS
    DENTRO DE UM DIA PARA AGENDAMENTOS DE SERVIÇOS PARA UM PRESTADOR
*/
interface IRequestDTO {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

//Hora e disponibilidade da hora:
type IResponse = Array<{
  hour: number;
  available: boolean;
}>;


@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({ provider_id, month, year, day }: IRequestDTO): Promise<IResponse> {
    //Recuperando todos os agendamentos do dia específico:
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id,
      month,
      year,
      day
    });

    //Primeira hora disponível em um dia para agendamentos:
    const hourStart = 8;

    //Criando array com a quantidade de horarios disponíveis em um dia:
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart
    );

    //Data atual:
    const currentDate = new Date(Date.now());

      //Percorrendo array para verificar se tem algum agendamento nesse horario específico:
      const availability = eachHourArray.map(hour => {
        const hasAppointmentInHour = appointments.find(appointment =>
          getHours(appointment.date) === hour
        );

        //Data para verificar se tem agendamento:
        const compareDate = new Date(year, month - 1, day, hour);

        //Retorna o horario e se ele está disponível p/ agendamento:
        return {
          hour,
          available: !hasAppointmentInHour && isAfter(compareDate, currentDate)
        }
      });

      /* avaliable: !hasAppointmentInHour && isAfter(compareDate, currentDate)
         -> Verifica se tem agendamento no horario específico e se ele é um horario
         que já passou (não posso marcar agendamentos no passado). */

    return availability;
  }
}

export default ListProviderDayAvailabilityService;


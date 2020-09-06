import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProvider';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProvider';
import IAppointmentsRepository from '@modules/appointments/repositories/IApointmentsRepository';
import { getRepository, Raw, Repository } from 'typeorm';
import Appointment from '../entities/Appointment';

class AppointmentsRepository
implements IAppointmentsRepository {
  //Criando repository do typeorm do tipo de entidade Appointment
  private ormRepository: Repository<Appointment>;

  //Constructor executa alguma coisa assim que o repositório for carregado:
  /* getRepository(Appointment) -> Cria o repository de appointment dando
    acesso a todos os métodos */
  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  // Método para encontrar um appointment em uma data específica:
  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    // Se não houverem datas iguais retorna nulo
    return findAppointment;
  }

  //Listando todos os agendamentos do dia de um prestador:
  public async findAllInDayFromProvider({
    provider_id,
    month, year, day }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0'); // => 1 = 01
    const parsedMonth = String(month).padStart(2, '0'); // => 1 = 01

     const appointments = await this.ormRepository.find({
       where: {
         provider_id,
         date: Raw(dateFieldName =>
           `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
         )
       },
       relations: ['user'],
     });

     return appointments;
   }

  //Listando todos os agendamentos do mês de um prestador:
  public async findAllInMonthFromProvider({
    provider_id,
    month, year }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
   const parsedMonth = String(month).padStart(2, '0'); // => 1 = 01

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        )
      }
    });

    return appointments;
  }

  //Método que vai criar e salvar um appointment no BD:
  public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    //Criando:
    const appointment = this.ormRepository.create({ provider_id, user_id, date });

    //Salvando no BD:
    await this.ormRepository.save(appointment);

    return appointment;
  }
}
// Uso: findByDate(date).then(response => {})

export default AppointmentsRepository;

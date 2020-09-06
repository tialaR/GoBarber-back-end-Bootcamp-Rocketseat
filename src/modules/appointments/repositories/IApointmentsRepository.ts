import ICreateAppointmentDTO from '../dtos/ICreateAppointmentsDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProvider';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProvider';
import Appointment from '../infra/typeorm/entities/Appointment';

//Estabelecendo os métodos que o repository precisa ter:
export default interface IAppointmentsRepository {
  //Vai criar e salvar um appointment
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  //Procurar appointment por data
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  //Procurar todos os appointments do mês de um prestador:
  findAllInMonthFromProvider(data: IFindAllInMonthFromProviderDTO): Promise<Appointment[]>;
  //Procurar todos os appointments do dia de um prestador:
  findAllInDayFromProvider(data: IFindAllInDayFromProviderDTO): Promise<Appointment[]>;
}

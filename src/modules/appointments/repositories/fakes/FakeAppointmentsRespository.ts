import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProvider';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProvider';
import IAppointmentsRepository from '@modules/appointments/repositories/IApointmentsRepository';
import { getDate, getMonth, getYear, isEqual } from 'date-fns';
import { uuid } from 'uuidv4';
import Appointment from '../../infra/typeorm/entities/Appointment';

class AppointmentsRepository
implements IAppointmentsRepository {

  private appointments: Appointment[] = [];

  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment => isEqual(appointment.date, date) &&
      appointment.provider_id === provider_id
    );

    return findAppointment;
  }

  //Listando todos os agendamentos do dia de um prestador:
  public async findAllInDayFromProvider({
     provider_id,
    month, year, day }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return(
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      )
    })

    return appointments;
  }

  //Listando todos os agendamentos do mês de um prestador:
  public async findAllInMonthFromProvider({
    provider_id, month, year }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return(
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      )
    })

    return appointments;
  }

  public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid, provider_id, user_id, date });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;

/* Nesse AppointmentRepository Fake vou criar as mesmas funcionalidades
que tenho no AppointmentRepository real da aplicação, porém sem
acessar o BD -> Criarei na mão as funcionalidades
-> Quando crio o Fake devo utilizar javaScript puro para simular
as funcionalidades.
-> O AppointmentRepository Fake deve seguir todos os métodos que tem na
interface IAppointmentsRepository para conseguir realizar os testes ->
O service depende que seja passado por parâmetro algo que tenha os
métodos estabelecidos em IAppointmentsRepository e nào necessáriamente
um repository do typeorm. -> Desde que o que for passado por parâmetro
tenhas os métodos (regras) do IAppointmentsRepository o service
aceita qualquer coisa.
-> a injeção de dependências não vai ter efeito nenhum nos testes, por isso
passo manualmente o repository.
*/

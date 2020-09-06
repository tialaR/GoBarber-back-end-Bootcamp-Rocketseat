import { getDate, getDaysInMonth, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import IAppointmentsRepository from '../repositories/IApointmentsRepository';

/* SERVICE RESPONSÁVEL POR LISTAR A DISPONIBILIDADE DE DIAS DISPONÍVEIS
    DENTRO DE UM MÊS PARA AGENDAMENTOS DE SERVIÇOS PARA UM PRESTADOR
*/
interface IRequestDTO {
  provider_id: string;
  month: number;
  year: number;
}

//Dia e disponibilidade do dia:
type IResponse = Array<{
  day: number;
  available: boolean;
}>;


@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
      private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({ provider_id, month, year }: IRequestDTO): Promise<IResponse> {
    //Query que retorna todos os agendamentos do mês:
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
      provider_id,
      year,
      month,
    });

    //Descobrindo a quant de dias no mês em questão:
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month -1));

    //Montando um array de dias do respectivo mês:
    const eatchDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1
    );

    //Percorrendo array para verificar se tem algum agendamento nesse dia específico:
    const avaliability = eatchDayArray.map(day => {

      /* Verificando de acordo com o ultimo horário do dia
          se o dia já passou o horario fica como desabilitado */
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day
      });

      /* Retorna o dia solicitado e se tem algum horario disponível para agendamento
          nesse dia ou não -> Caso tenha pelo menos um horário disponível
          esse dia do mês retorna-rá como available true */
      return {
        day,
        //Em um dia só pode ter 10 agendamentos (das 8h as 17h)
        available: isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
        // isAfter -> Verifica se esse dia do mês já passou c/ relação a data de hoje
      }
    });


    return avaliability;
  }
}

export default ListProviderMonthAvailabilityService;

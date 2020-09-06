import { inject, injectable } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IApointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
/* SERVICE RESPONSÁVEL POR LISTAR OS AGENDAMENTOS DO PRESTADOR DE SERVIÇO NO DIA
Esse serviçe servirá para que o prestador possa vizualizar seus agendamentos do dia */
interface IRequestDTO {
  provider_id: string; //Prestador que quero listar os agendamentos
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
      private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
      private cacheProvider: ICacheProvider
  ) {}
  public async execute({ provider_id, day, month, year }: IRequestDTO): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey
    );


    if(!appointments) {
      //Recuperando todos os agendamentos de um dia só para um prestador de serviço:
      appointments = await this.appointmentsRepository.findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year
      });

      // console.log('buscou do BD');

      await this.cacheProvider.save(cacheKey, classToClass(appointments));
    }

    return appointments;
  }
}

export default ListProviderAppointmentsService;

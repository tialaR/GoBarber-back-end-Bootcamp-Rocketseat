import FakeAppointmentsRespository from '../repositories/fakes/FakeAppointmentsRespository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

/* TESTE RESPONSÁVEL POR LISTAR A DISPONIBILIDADE DE DIAS DISPONÍVEIS
    DENTRO DE UM MÊS PARA AGENDAMENTOS DE SERVIÇOS PARA UM PRESTADOR
*/

let fakeAppointmentsRepository: FakeAppointmentsRespository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRespository();

    listProviderMonthAvailabilityService  = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository
    );
  })

  // Simula a listagem da disponibilidade de dias disponíveis p/ agendamentos em um mês específico
  it('should be able to list the month availability from provider', async () => {
    //Criando agendamento no mesmo mês
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    //Criando agendamento no mesmo mês
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 9, 0, 0),
    });

    //Criando agendamento no mesmo mês
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    //Criando agendamento no mesmo mês
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 11, 0, 0),
    });

    //Criando agendamento no mesmo mês
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 12, 0, 0),
    });

    //Criando agendamento no mesmo mês
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 13, 0, 0),
    });

    //Criando agendamento no mesmo mês
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    //Criando agendamento no mesmo mês
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    //Criando agendamento no mesmo mês
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 16, 0, 0),
    });

    //Criando agendamento no mesmo mês
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 17, 0, 0),
    });

    //Criando agendamento no mesmo mês em um dia diferente:
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
    });

    //É esperado que exista uma array contendo os campos abaixo
    //Para ser available precisa ter pelo menos um horário disponível no dia
    /* O dia 20 deve retornar false pois preenchemos todos os
    horarios p/ agendamentos disponíveis nesse dia. O dia 21 deve retornar
    true pois só marcamos um horaio para esse dia. Retorna false somente para
    os dias que estão com todos os horarios preenchidos (dia indisponível) */
    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ])
    );

  });
});



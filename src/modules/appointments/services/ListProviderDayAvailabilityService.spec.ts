import FakeAppointmentsRespository from '../repositories/fakes/FakeAppointmentsRespository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

/* TESTE RESPONSÁVEL POR LISTAR A DISPONIBILIDADE DE HORAS
    DENTRO DE UM DIA PARA AGENDAMENTOS DE SERVIÇOS PARA UM PRESTADOR
*/

let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;
let fakeAppointmentsRespository: FakeAppointmentsRespository;

describe('ListProviderDayAvailability', () => {

  beforeEach(() => {
    fakeAppointmentsRespository = new FakeAppointmentsRespository();

    listProviderDayAvailabilityService  = new ListProviderDayAvailabilityService(
      fakeAppointmentsRespository
    );
  })

  // Simula a listagem da disponibilidade de horas disponíveis p/ agendamentos em um dia específico
  it('should be able to list the day availability from provider', async () => {
    //Criando agendamento em uma hora do dia escolhido:
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    //Criando agendamento em outra hora do dia escolhido:
    await fakeAppointmentsRespository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    //todos os horarios antes das 11 devem estar indisponíveis
    //Não poderemos marcar agendamentos no passado:
    //Simula que a hora atual é 11hrs
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: 'user',
      month: 5,
      year: 2020,
      day: 20,
    });

    //É esperado que exista uma array contendo os campos abaixo
    /* Não será possível marcar agendamentos no passado e em horarios já ocupados
    ou seja, todos os horários que marcamos agendamentos devem retornar como avaliable
    false */
    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ])
    );

  });
});



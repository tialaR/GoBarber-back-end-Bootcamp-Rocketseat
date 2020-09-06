import FakeAppointmentsRespository from '../repositories/fakes/FakeAppointmentsRespository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

/* TESTE RESPONSÁVEL POR TESTAR A LISTAGEM DOS AGENDAMENTOS DO PRESTADOR DE SERVIÇO NO DIA
Esse serviçe servirá para que o prestador possa vizualizar seus agendamentos do dia */

let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;
let fakeAppointmentsRespository: FakeAppointmentsRespository;

describe('ListProviderAppointmentsService', () => {

  beforeEach(() => {
    fakeAppointmentsRespository = new FakeAppointmentsRespository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderAppointmentsService  = new ListProviderAppointmentsService(
      fakeAppointmentsRespository,
      fakeCacheProvider,
    );
  })

  // Simula a listagem dos agendamentos de um prestador em um dia específico
  it('should be able to list the appointments on a specifc day', async () => {
    //Criando agendamento no mesmo dia escolhido
    const appointment1 = await fakeAppointmentsRespository.create({
      provider_id: 'provider_id',
      user_id: 'user',
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    //Criando agendamento no mesmo dia escolhido
    const appointment2 = await fakeAppointmentsRespository.create({
      provider_id: 'provider_id',
      user_id: 'user',
      date: new Date(2020, 4, 20, 9, 0, 0),
    });

    //Executando o service para listar os agendamentos do dia:
    const appointments = await listProviderAppointmentsService.execute({
      provider_id: 'provider_id',
      day: 20,
      year: 2020,
      month: 5,
    });

    /* É esperado que appointments seja uma array contendo appointment1 e appointment2
    que foram os agendamentos que criamos para o dia que queremos listar os
    agendamentos que um prestador tem marcado em um dia */
    expect(appointments).toEqual([appointment1, appointment2]);

  });
});



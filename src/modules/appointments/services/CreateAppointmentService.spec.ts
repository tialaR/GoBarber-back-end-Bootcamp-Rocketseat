//ARQUIVO DE TESTES DE CREATEAPPOINTMENTSERVER

import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRespository from '../repositories/fakes/FakeAppointmentsRespository';
import CreateAppointmentService from './CreateAppointmentService';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';

let fakeAppointmentsRespository: FakeAppointmentsRespository;
let createAppointmentService: CreateAppointmentService;
let fakeCacheProvider: FakeCacheProvider;
let fakeNotificationsRepository: FakeNotificationsRepository;

describe('CreateAppointment', () => {

  beforeEach(() => {
    fakeAppointmentsRespository = new FakeAppointmentsRespository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRespository,
      fakeNotificationsRepository,
      fakeCacheProvider
    );
  })

  //Testa a criação de um novo appointment
  //Salva na memória da aplicação enquanto executa os testes:
  it('should be able to create a new appointment', async () => {

    //Reescrevendo a implementação da função Date:
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 10, 12).getTime();
    });

    //Salvando no repositório fake
    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 10, 10, 13),
      user_id: 'user_id',
      provider_id: 'provider_id'
    });

    /* Para validar o teste estabeleci que para dar certo o appointment
    deve ter uma propriedade chamada id  -> Se meu teste criou essa prop, ou seja,
    se ele chegou nessa fase isso significa que o nosso teste de criação de
    appointments deu certo */
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider_id');
  });


  //Testa a criação de um appointment da mesma data e horário
  it('shold be able to create two appointments in the same date', async() => {
    const appointmentDate = new Date(2020, 10, 10, 16);

    await createAppointmentService.execute({
      date: appointmentDate,
      user_id: 'user_id',
      provider_id: 'provider_id'
    });

   /* É esperando que a função abaixo rejeite o que está sendo executado
   e que o erro seja um erro do tipo AppError: */
    expect(createAppointmentService.execute({
        date: appointmentDate,
        user_id: 'user_id',
        provider_id: 'provider_id'
      })).rejects.toBeInstanceOf(AppError);
    });

    //Não poderemos criar agendamentos em uma data que já passou
    it('should not be able to create an appointment on past date', async () => {
      //Simulando que estamos no passado:
      //Reescrevendo a implementação da função Date:
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2020, 10, 10, 12).getTime();
      });

    /* É esperando que a função abaixo rejeite o que está sendo executado
     e que o erro seja um erro do tipo AppError:
     Tentando marcar agendamento em uma hora que já passou: */
    expect(createAppointmentService.execute({
      date: new Date(2020, 10, 10, 11),
      user_id: 'user_id',
      provider_id: 'provider_id'
    })).rejects.toBeInstanceOf(AppError);
  });

  //Um usuário não pode criar um agendamento com ele mesmo
  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 10, 12).getTime();
    });

    expect(createAppointmentService.execute({
      date: new Date(2020, 10, 10, 13),
      user_id: 'provider_id',
      provider_id: 'provider_id'
    })).rejects.toBeInstanceOf(AppError);
  });

  //Um usuário não pode criar um agendamento antes das 8hrs e depois das 17hrs
  it('should not be able to create an appointment before 8amand after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 10, 12).getTime();
    });

    expect(createAppointmentService.execute({
      date: new Date(2020, 10, 11, 7),
      user_id: 'user_id',
      provider_id: 'provider_id'
    })).rejects.toBeInstanceOf(AppError);

    expect(createAppointmentService.execute({
      date: new Date(2020, 10, 11, 18),
      user_id: 'user_id',
      provider_id: 'provider_id'
    })).rejects.toBeInstanceOf(AppError);
  });
});


/**
 * -> describe é como se fosse a categoria do teste, nesse caso especifiquei que
 * seria de criação de appointments
 *
 * -> Um arquivo de testes pode conter vários testes.
 *
 * -> expect é uma função global que vou utilizar em todos os testes,
 *  que quer dizer o que que eu espero com aquele teste/ o que ele me
 * devolva ou o que ele mostre de informações
 */


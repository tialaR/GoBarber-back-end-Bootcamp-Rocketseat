//ARQUIVO QUE REGISTRA A INJEÇÃO DE DEPENDÊNCIAS QUE USAREMOS NA APLICAÇÃO
/* Injetaremos os repositórios nos serviçes que desejarmos (assim poderemos
utilizar os métodos oferecidos pelo repository injetado de forma indireta, ou seja
sem que o nosso serviçe que é reponsável pela regra de negócio tenha acesso direto
a lib do typeorm) */

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IApointmentsRepository from '@modules/appointments/repositories/IApointmentsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import '@modules/users/providers';
import IAUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import { container } from 'tsyringe';
import './providers';

//Método que recebe o id (AppointmentsRepository) e retorna o repository (AppointmentsRepository)
container.registerSingleton<IApointmentsRepository>(
    'AppointmentsRepository', AppointmentsRepository
  );

  container.registerSingleton<IAUsersRepository>(
    'UsersRepository', UsersRepository
  );

  container.registerSingleton<IUserTokensRepository>(
    'UserTokensRepository', UserTokensRepository
  );

  container.registerSingleton<INotificationsRepository>(
    'NotificationsRepository', NotificationsRepository
  );

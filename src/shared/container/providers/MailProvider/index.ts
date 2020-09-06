import mailConfig from '@config/mail';
import { container } from 'tsyringe';
import EtherialMailProvider from './implementations/EtherialMailProvider';
import SESMailProvider from './implementations/SESMailProvider';
import IMailProvider from './models/IMailProvider';

//Arquivo que contem tudo que for referente a configuração do provedor de envio de e-mail

const mailProviders = {
  ethereal: container.resolve(EtherialMailProvider),
  ses: container.resolve(SESMailProvider),
}

container.registerInstance<IMailProvider>(
  'MailProvider',
  mailProviders[mailConfig.driver]
);

/* Quando na configuração de e-mail (arquivo mailConfig.ts) estiver
  utilizando o ethereal eu usarei o EtherialMailProvider e quando estiver
  utilizando o ses eu usarei o SESMailProvider.
  Isso serve para toda vez que eu tiver um novo provider basta somente
  adiciona-lo no objeto. */

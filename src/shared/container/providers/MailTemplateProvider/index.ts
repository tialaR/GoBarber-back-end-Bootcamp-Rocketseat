import { container } from 'tsyringe';
import HandlebarsMailTemplateProvider from './implementations/HandlebarsMailTemplateProvider';
import IMailTemplateProvider from './models/IMailTemplateProvider';

//Arquivo que contem tudo que for referente a configuração do provedor de template de e-mail

const providers = {
  handlebars: HandlebarsMailTemplateProvider,
}

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers.handlebars,
);


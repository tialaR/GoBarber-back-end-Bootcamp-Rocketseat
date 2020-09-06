import mailConfig from '@config/mail';
import aws from 'aws-sdk';
import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

// Provedor (Provider) de envio de e-mail padrão em ambiente de produção:
@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    /* Um provider pode depender de outro, com isso é possível
    fazer a injeção de dependência detro do provider -> Nesse caso
    o provider de envio de e-mail depender do provider de
    template de e-mail */
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    //Criando transporter:
    // create Nodemailer SES transporter
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
          apiVersion: '2010-12-01',
          region: 'us-east-1'
      })
    });
  }

  public async sendMail({ to, subject, from, templateData }: ISendMailDTO): Promise<void>{
    const { name, email } = mailConfig.defaults.from;

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}

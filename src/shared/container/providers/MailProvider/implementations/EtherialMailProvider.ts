import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

// Provedor (Provider) de envio de e-mail padrão em ambiente de desenvolvimento:
@injectable()
export default class EtherialMailProvider implements IMailProvider {
  private client: Transporter;


  constructor(
    /* Um provider pode depender de outro, com isso é possível
    fazer a injeção de dependência detro do provider -> Nesse caso
    o provider de envio de e-mail depender do provider de
    template de e-mail */
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    //Criando conta de teste
    nodemailer.createTestAccount().then(account => {
      //Criando transporter
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
      });

      this.client = transporter;
    });
  }

  public async sendMail({ to, subject, from, templateData }: ISendMailDTO): Promise<void>{
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com.br'
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });

    //Teste para verificar se o email foi enviado
    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

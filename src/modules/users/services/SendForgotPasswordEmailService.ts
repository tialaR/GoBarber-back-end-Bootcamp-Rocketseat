import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import path from 'path';
import { inject, injectable } from 'tsyringe';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequestDTO {
  email: string;
}

// SERVICE PARA ENVIO DE E-MAIL PARA RECUPERAÇÃO DE SENHA

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokenRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequestDTO): Promise<void> {
    //Verificando se usuário existe
    const user = await this.usersRepository.findByEmail(email);

    //Retorna erro caso usuário não exista
    if(!user) {
      throw new AppError('User does not exists.');
    }

    //Gera token de recuperação de senha caso usuário exista (cria no BD):
     const { token } =  await this.userTokenRepository.generate(user.id);

     //Buscando diretorio do arquivo contendo o Html do template de e-mail de alteração de senha:
     const forgotPasswordTemplate = path.resolve(
       __dirname, '..', 'views', 'forgot_password.hbs'
      );

    //Envia e-mail de recuperação de senha para o usuário que requisitou:
    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`
        }
      }
    });
  }
}

export default SendForgotPasswordEmailService;

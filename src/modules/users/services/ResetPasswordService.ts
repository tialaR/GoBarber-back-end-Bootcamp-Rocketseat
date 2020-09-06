import AppError from '@shared/errors/AppError';
import { addHours, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequestDTO {
  token: string;
  password: string;
}

// SERVICE PARA RESETAR SENHA DO USUÁRIO ATRAVÉS DE UM TOKEN DE RECUPERAÇÃO DE SENHA

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokenRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ password, token }: IRequestDTO): Promise<void> {
    //Buscando token do usuário para resetar a senha
    const userToken = await this.userTokenRepository.findByToken(token);

    //Verificando se existe token de alteração de senha
    if(!userToken) {
      throw new AppError('User token does not exists.');
    }

    //Buscando usuário que gerou o token de recuperação de senha
    const user = await this.usersRepository.findById(userToken.user_id);

    //Verificando se usuário existe
    if(!user) {
      throw new AppError('User does not exists.');
    }

    //Resgatando data e hora de criação do token
    const tokenCreatedAt = userToken.created_at;

    /* Adicionando 2hrs a data de criação do token p/ verificar se ele expirou */
    const compareDate = addHours(tokenCreatedAt, 2);

    /*Verificando se já passou 2hrs do momento que o token foi criado p/ agora
      (hora limite p/ expiração do token) */
    if(isAfter(Date.now(), compareDate)) {
      //Se a data atual for igual a data que o token foi gerado + 2hrs disparo um erro
      //O token tem um limite de expiração de 2hrs
      throw new AppError('Token expired.');
    }

    //Alterando senha com hash caso todas as condições sejam atendidas
    user.password = await this.hashProvider.generateHash(password);

    //Salvando usuário com senha atualizada no BD
    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;

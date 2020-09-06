import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  email: string;
  password: string;
}

interface IResponseDTO {
  user: User;
  token: string;
}

// VALIDANDO CREDENCIAIS DE USUÁRIO (LOGIN)

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ email, password }: IRequestDTO): Promise<IResponseDTO> {

    // Verificar se o email é de um usuário válido
    const user = await this.usersRepository.findByEmail(email);

    // Verificando email correto
    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    // user.password -> Senha criptografada que foi salva no banco
    // password -> Senha não criptografada (login)

    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

    // Verificando senha correta
    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    // Usuário autenticado

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;

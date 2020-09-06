import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequestDTO {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private iHashProvider: IHashProvider,

    @inject('CacheProvider')
      private cacheProvider: ICacheProvider
  ) {}

  public async execute({ name, email, password }: IRequestDTO): Promise<User> {

    // Verificando se usuário existe no banco
    const checkUserExists = await this.usersRepository.findByEmail(email);

    // Caso o usuário exista no banco mostro um erro
    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    // Criptografia de senha
    const hashedPassword = await this.iHashProvider.generateHash(password);

    // Criar usuário no BD:
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    //Invalidando cache de lista de providers ao criar um novo usuário na aplicação:
    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}

export default CreateUserService;

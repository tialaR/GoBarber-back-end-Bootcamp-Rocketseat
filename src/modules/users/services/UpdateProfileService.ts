import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ user_id, name, email, password, old_password }: IRequestDTO): Promise<User> {
    //Buscando usuário no BD:
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new AppError('User not found.');
    }

    //Verificando se o novo e-mail informado pelo usuário para atualização já existe:
    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    /* Caso o e-mail já exista e não pertença ao
    usuário que deseja realizar a atualização dos campos disparo um erro */
    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('E-mail already in use.');
    }

    //Atualizando dados do usuário
    user.name = name;
    user.email = email;

    //Caso o usuário não informe a senha antiga para atualizar a nova um erro deve ser disparado
    if(password && !old_password) {
      throw new AppError('You need to inform the old password to set a new password.');
    }

    //Atualizando senha do usuário:
    if(password && old_password) {
      /* Comparando senha do usuário que está armazenada no BD (user.password) bate
      com a senha informada (old_password) */
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password
      );

      //Caso a senha antiga seja informada errada um erro deve ser disparado
      if(!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }

      //Caso tudo dê certo a senha deve ser atualizada:
      user.password = await this.hashProvider.generateHash(password);
    }

    //Salvando usuário atualizado no BD e retorna usuário atualizado:
    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;

import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
}

// SERVICE RESPONSÁVE; POR MOSTRAR DADOS DO USUÁRIO LOGADO

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequestDTO): Promise<User> {
    //Buscando usuário no BD:
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new AppError('User not found.');
    }

   return user;
  }
}

export default ShowProfileService;

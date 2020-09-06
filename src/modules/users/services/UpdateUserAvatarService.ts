import IStorageProvider from '@shared/container/providers/StorageProvidre/models/IStorageProvider';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ user_id, avatarFileName }: IRequestDTO): Promise<User> {

    const user = await this.usersRepository.findById(user_id);

    // Caso o usuário não esteja autenticado não poderá criar/atualizar avavatar
    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    // Caso o usuário já tivesse um avatar
    if (user.avatar) {
      //Deleto o avatar anterior para colocar um novo:
      await this.storageProvider.deleteFile(user.avatar);
    }

    //Criando novo avatar:
    const fileName = await this.storageProvider.saveFile(avatarFileName);

    user.avatar = fileName;

    // Como o usuário tem um id e está salvo no banco -> ele será atualizado com a inserção do avatar
    // O método save tambem serve para atualizar informações caso elas já existam no banco
    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;

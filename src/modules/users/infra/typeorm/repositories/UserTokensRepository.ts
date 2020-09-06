import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import { getRepository, Repository } from 'typeorm';
import UserToken from '../entities/UserToken';

class UserTokensRepository
implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  //Método que vai procurar o usuário pelo token de recuperação de senha:
  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { token }
    });

    return userToken;
  }

  //Criando token de recuperação de senha do usuário no BD
  public async generate(user_id: string): Promise<UserToken> {
    //A geração do token acontecerá de forma automática
    const userToken = this.ormRepository.create({
      user_id,
    });

    await this.ormRepository.save(userToken);

    //Retorna o token de recuperação de senha criado
    return userToken;
  }
}

export default UserTokensRepository;

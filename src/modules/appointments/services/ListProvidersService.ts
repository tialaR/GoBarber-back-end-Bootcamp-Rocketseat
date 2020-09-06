import User from '@modules/users/infra/typeorm/entities/User';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

interface IRequestDTO {
  user_id: string;
}

// SERVICE RESPONSÁVE POR LISTAR PRESTADORES DE SERVIÇO

@injectable()
class ListProvidresService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
      private cacheProvider: ICacheProvider
  ) {}

  public async execute({ user_id }: IRequestDTO): Promise<User[]> {

    //Buscando lista de usuários no cache:
    let users = await this.cacheProvider.recover<User[]>(`providers-list:${user_id}`);

    //Caso não exista a lista no cache eu realizo a busca no BD e salvo no cache:
    if(!users) {
      //Exibir todos os usuários, menos o que está logado (busca no BD):
      users = await this.usersRepository.findAllProvidres({
        except_user_id: user_id
      });

      // console.log('a query foi feita.');

      //Salvando a lista de usuários no cache:
      await this.cacheProvider.save(`providers-list:${user_id}`, classToClass(users));
      /*
        Coloco o user_id para identificar qual é o usuário logado
        `providers-lis:${user_id}` => É a chave do cache
      */
    }

   return users;
  }
}

export default ListProvidresService;

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { getRepository, Not, Repository } from 'typeorm';
import User from '../entities/User';

class UsersRepository
implements IUsersRepository {
  //Criando repository do typeorm do tipo de entidade User
  private ormRepository: Repository<User>;

  //Constructor executa alguma coisa assim que o repositório for carregado:
  /* getRepository(User) -> Cria o repository de user dando
    acesso a todos os métodos */
  constructor() {
    this.ormRepository = getRepository(User);
  }

  //Método que vai procurar o usuário pelo id:
  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);
    return user;
  }

  //Método que vai procurar o usuário pelo email:
  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });
    return user;
  }

  //Listar todos os usuários, menos o usuário logado na aplicação:
  public async findAllProvidres({ except_user_id }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if(except_user_id) {
      // Retorna todos os usuários, menos o usuário logado:
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id)
        }
      })
    } else {
      //Retorna todos os usuários
      users = await this.ormRepository.find();
    }

    return users;
  }

  //Método que vai criar e salvar um user no BD:
  public async create(userData: ICreateUserDTO): Promise<User> {
    // Criar instância de usuário (a instância não salva no BD)
    const user = this.ormRepository.create(userData);
    //Salvando no BD:
    await this.ormRepository.save(user);

    return user;
  }

  //Método que vai salvar ou atualizar um usuário no BD
  // O método save tambem serve para atualizar informações caso elas já existam no banco
  public async save(user: User): Promise<User> {
    return await this.ormRepository.save(user);
  }
}

export default UsersRepository;

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '../dtos/IFindAllProvidersDTO';
import User from '../infra/typeorm/entities/User';

//Métodos que o repository de User vai ter:
export default interface IUsersRepository {
  //Procura o usuário pelo id e retorna o usuário ou não:
  findById(id: string): Promise<User | undefined>;
  //Procura o usuário pelo email e retorna o usuário ou não:
  findByEmail(email: string): Promise<User | undefined>;
  //Cria um usuário:
  create(data: ICreateUserDTO): Promise<User>;
  //Salva ou atualiza usuário no BD:
  save(user: User): Promise<User>;
  //Listar todos os usuários, menos o usuário logado na aplicação:
  findAllProvidres(data: IFindAllProvidersDTO): Promise<User[]>;
}

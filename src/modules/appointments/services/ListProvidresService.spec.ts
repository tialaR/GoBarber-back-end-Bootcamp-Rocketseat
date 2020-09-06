import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

//TESTES PARA MOSTRAR LISTAR PRESTADORES DE SERVIÇO

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProvidersService  = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  })

  // Simula a listagem de pretadores de serviço
  it('should be able to list the providres', async () => {
    //Criando usuários para listar:

    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123456'
    });

    //Usuário logado:
    const loggedUser = await fakeUsersRepository.create({
      name: 'John Qua',
      email: 'johnqua@example.com',
      password: '123456'
    });

    //Lista todos os usuários menos o usuário logado:
    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    //É esperado que seja um array contendo todos os usuários menos o logado na aplicação
    expect(providers).toEqual([
      user1,
      user2
    ])
  });
});



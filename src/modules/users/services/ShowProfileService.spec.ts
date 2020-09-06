import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

//TESTES PARA MOSTRAR PERFIL DO USUÁRIO

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfileService  = new ShowProfileService(
      fakeUsersRepository,
    );
  })

  // Simula que um usuário logado possa vizualizar os dados do seu perfil
  it('should be able to show the profile', async () => {
    //Criando usuário
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    //Mostrar dados do usuário a partir de seu id:
    const profile = await showProfileService.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@example.com');
  });

  //Simula a tentativa de exibir o perfil de um usuário que não existe:
  it('should not be able to show the profile from non-existing user', async () => {
    await expect(showProfileService.execute({
      user_id: 'non-existing-user-id',
    })).rejects.toBeInstanceOf(AppError);
  });
});



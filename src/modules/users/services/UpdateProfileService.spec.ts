import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

//TESTES PARA ATUALIZAÇÃO DO PROFILE DO USUÁRIO

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService  = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  })

  // Simula que um usuário seria capaz de conseguir atualizar seu profile
  it('should be able to update the profile', async () => {
    //Criando usuário
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    //Realizando update no profile (deve retornar o usuário atualizado):
    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Trê',
      email: 'jhontre@example.com'
    });

    expect(updatedUser.name).toBe('Jhon Trê');
    expect(updatedUser.email).toBe('jhontre@example.com');
  });

  //Simula a tentativa de atualizar o perfil de um usuário que não existe:
  it('should not be able to update the profile from non-existing user', async () => {
    await expect(updateProfileService.execute({
      user_id: 'non-existing-user-id',
      name: 'Teste',
      email: 'teste@example.com'
    })).rejects.toBeInstanceOf(AppError);
  });

  // Usuário não pode atualizar seu e-mail para um e-mail já utilizado:
  it('should be not be able to change to another user email', async () => {
    //Criando usuário
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    //Criando usuário que vai receber atualização:
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@example.com',
      password: '123456'
    });

    //Não deve permitir que um usuário use um e-mail que já existe no BD:
    /* o user Teste não pode ser capaz de atualizar seu e-mail para o e-mail
    do 'johndoe@example.com' pois ele supostamente já existe na base de dados */
    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Doe',
      email: 'johndoe@example.com'
    })).rejects.toBeInstanceOf(AppError);
  });


  //Para atualizar a sua senha o usuário deve informar a senha antiga:
  it('should be able to update the password', async () => {
    //Criando usuário
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    //Realizando update no profile (deve retornar o usuário atualizado):
    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Trê',
      email: 'jhontre@example.com',
      old_password: '123456',
      password: '123123'
    });

    expect(updatedUser.password).toBe('123123');
  });

  //Verificando se o usuário informou a senha antiga para atualizar com uma nova senha:
  it('should not be able to update the password without old password', async () => {
    //Criando usuário
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    //Caso a senha antiga não seja informada um erro deve ser retornado:
    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Trê',
      email: 'jhontre@example.com',
      password: '123123'
    })).rejects.toBeInstanceOf(AppError);
  });

  //O usuário não pode atualizar o perfil dele se ele informar a senha antiga errada
  it('should not be able to update the password without wrong old password', async () => {
    //Criando usuário
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    //Caso a senha antiga não esteja correta um erro deve ser retornado:
    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Jhon Trê',
      email: 'jhontre@example.com',
      old_password: 'wrong_old_password',
      password: '123123'
    })).rejects.toBeInstanceOf(AppError);
  });
});



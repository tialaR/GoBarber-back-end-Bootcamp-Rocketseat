import FakeStorageProvider from '@shared/container/providers/StorageProvidre/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar  = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  })

  // Simula a criação/atualização do avatar de um usuário
  it('should be able to update avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg'
    });

    expect(user.avatar).toBe('avatar.jpg');
  });


  //Testando se o é possível atualiza o avatar de um usuário que não existe
  it('should not be able to update avatar from non existing user', async () => {
    await expect(updateUserAvatar.execute({
      user_id: 'non-existing-user',
      avatarFileName: 'avatar.jpg'
    })).rejects.toBeInstanceOf(AppError);
  });


  // Simula deletar avatar antigo quando estiver inserindo um novo
  it('should delete old avatar when updating new one', async () => {
    //Espionando função deleteFile de fakeStorageProvider:
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg'
    });

    //Simulando arualização do avatar:
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg'
    });

    //Verificando se a função deleteFile foi disparada:
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});

/**
  SPY -> Podemos espionar se alguma função da nossa aplicação
  foi executada.
  spyOn() -> com esse método do jest é possível observar qualquer
  função da nossa aplicação.

  const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
  -> Método do jest que vai espionar a execução da função deleteFile
  dentro de fakeStorageProvider e retorna a função.

  expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
  -> Estou querendo dizer que espero que a finção deleteFile
  tenha sido chamada com um determinado parâmetro.
 */


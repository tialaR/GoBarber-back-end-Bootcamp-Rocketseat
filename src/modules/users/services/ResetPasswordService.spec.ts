import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

//Declarando variáveis globais para os testes:
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPasswordService', () => {

  //Função que vai disparar antes de cada um dos testes:
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  //Teste para que seja possível trocar de senha
  it('should be able to reset the password', async () => {
    //Criando usuário
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    //Criando token de reset de senha do usuário
    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    //Enviando email
    await resetPasswordService.execute({
      password: '123123',
      token
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    //Validando se foi chamada a função de geração de hash com a nova senha
    expect(generateHash).toHaveBeenCalledWith('123123');
    //Validando se foi possível alterar a senha
    expect(updatedUser?.password).toBe('123123');
  });

  //Não será possivel resetar o password com um token inexistente
  it('should be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  //Não será possivel resetar o password com um usuário inexistente
  it('should be able to reset the password with non-existing user', async () => {
    const userToken = await fakeUserTokensRepository.generate('non-existing-user');

    await expect(
      resetPasswordService.execute({
        token: userToken.token,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  //Não será possivel resetar o password com um token expirado
  it('should be able to reset the password if passed more than 2 hours', async () => {
    //Criando usuário
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    //Criando token de reset de senha do usuário
    const { token } = await fakeUserTokensRepository.generate(user.id);

    /* Alterando o funcionamento normal da variável global date do JS para
      simular que quando ela for chamada pule 3hrs para o futuro
      Quando o código chamar a função Date.now() essa função
      retornará a data atual + 3hrs */
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    //Simulando que o reset da senha 2hrs depois de gerar o token:
    await expect(
      resetPasswordService.execute({
        password: '123123',
        token
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});


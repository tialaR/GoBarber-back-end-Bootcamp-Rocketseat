import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

//Declarando variáveis globais para os testes:
let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {

  //Função que vai disparar antes de cada um dos testes:
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );
  });

  it('should be able to recover the password using the email', async () => {
    //Verificar se o método foi disparado
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    //Criando usuário
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    //Enviando email
    const user = await sendForgotPasswordEmailService.execute({
      email: 'johndoe@example.com',
    });

    //Validando se a função sendMail foi chamada (se o email foi enviado)
    expect(sendMail).toHaveBeenCalled();
  });

  //Não pode recuperar a senha de um usuário que não existe
  it('should not be able to recover a not-existing user password', async () => {
    //Enviando email p/ um usuário não existente (é esperado que essa ação retorne um erro)
    await expect(sendForgotPasswordEmailService.execute({
      email: 'johndoe@example.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  /*Testando se o token de recuperação de senha é gerado quando
    é realizada uma recuperação de senha válida (de um usuário que existe) */
    it('should generate a forgot password token', async () => {
    //Verificar se o método foi disparado
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    //Criando usuário
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    //Enviando email de usuário existente
    await sendForgotPasswordEmailService.execute({
      email: 'johndoe@example.com',
    });

    //Validando se a função generateToken foi chamada passando o id do usuário como parâmetro
    expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});


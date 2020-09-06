import IHashProvider from '../models/IHashProvider';

//Arquivo fake que simula a criação de um hash na aplicação

class FakeHashProvider implements IHashProvider {
  // Simula Criptografia de senha
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  // hashed -> simula senha criptografada
  // password -> simula senha não criptografada (login)
  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}

export default FakeHashProvider;

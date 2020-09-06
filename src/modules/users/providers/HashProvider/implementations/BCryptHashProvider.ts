import { compare, hash } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

//Arquivo que implementa o BCrypt da aplicação

class BCryptHashProvider implements IHashProvider {
  // Criptografia de senha
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  // hashed -> Senha criptografada que foi salva no banco
  // password -> Senha não criptografada (login)
  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}

export default BCryptHashProvider;

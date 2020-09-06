//Métodos que um provedor de Hash precisa ter
export default interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  compareHash(payload: string, hashed: string): Promise<boolean>;
}

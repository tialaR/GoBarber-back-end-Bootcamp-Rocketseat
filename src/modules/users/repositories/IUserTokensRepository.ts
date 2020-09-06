import UserToken from "../infra/typeorm/entities/UserToken";

//Definindo o que deve ser feito para gerar um token de recuperação de senha:
export default interface IUserTokensRepository {
  //Recebe o id do usuário que quero gerar o token:
  generate(user_id: string): Promise<UserToken>;
  //Encontrar um usuário pelo token:
  findByToken(token: string): Promise<UserToken | undefined>;
}

import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

/* Controller responsável por resetar a senha
    para o usuário
*/
export default class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    /* Para resetar a senha deve-se enviar o token gerado e enviado por e-mail
     para reset de senha e a nova senha */
    const { password, token } = request.body;

    /* Devemos chamar o service de reset de senha para aplicar a regra de negócio
    relacionada a troca de senha */
    const resetPasswordService = container.resolve(
      ResetPasswordService
    );

    /* Devemos chamar o método execute referente ao service de troca de senha
    passando a nova senha e o token recebidos no corpo da requisição */
    await resetPasswordService.execute({
      password,
      token,
    });

    //Retorna sucesso sem mendagem no corpo da resposta
    return response.status(204).json();
  }
}

import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

/* Controller responsável por lhe dar com o envio de email
    para o usuário que requisitou uma nova senha
*/
export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    //Para receber o e-mail de reset da senha precisamos informar apenas o email no body da requisição
    const { email } = request.body;

    //Chama o service para resolver a regra de negócio referente ao envio de e-mail para reset de senha
    const sendForgotPasswordEmailService = container.resolve(
      SendForgotPasswordEmailService
    );

    /*Passa o email que veio no body da requisição para o método execute do service para
    que ele trate de enviar o e-mail para o usuário que solicitou o resgate da senha */
    await sendForgotPasswordEmailService.execute({
      email,
    });

    //Retorna sucesso sem mendagem no corpo da resposta
    return response.status(204).json();
  }
}

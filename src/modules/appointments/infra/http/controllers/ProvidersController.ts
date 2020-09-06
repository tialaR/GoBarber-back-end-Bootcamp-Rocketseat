import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    //Recuperando usuário logado:
    const user_id = request.user.id;

    // Instanciando o service ListProvidersService:
    //Repositório de appointmemnts injetado de forma automática pelo container
    const listProvidersService = container.resolve(ListProvidersService);

    //Lista de usuários excluindo dela o usuário logado:
    const providers = await listProvidersService.execute({
      user_id
    });

    return response.json(classToClass(providers));
  }
}

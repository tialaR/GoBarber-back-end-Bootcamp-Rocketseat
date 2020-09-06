//CONTROLLER P/ ALTERAÇÃO DO PERFIL DO USUÁRIO LOGADO:
import ShowProfileService from '@modules/users/services/ShowProfileService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProfileController {

  //Rota para mostrar perfil do usuário:
  public async show(request: Request, response: Response): Promise<Response>  {
    //Para realizar a chamada dessa rota o usuário precisa estar autenticado:
      const user_id = request.user.id;

      const showProfile = container.resolve(ShowProfileService);

      //Executando método do servivce ShowProfileService para mostrar dados do usuário
      const user = await showProfile.execute({ user_id });

      //Retorna todos os dados do usuário logado
      return response.json(classToClass(user));
  }

  //Rota para atualizar perfil do usuário logado:
  public async update(request: Request, response: Response): Promise<Response> {
    try {
      //Para realizar a chamada dessa rota o usuário precisa estar autenticado:
      //Precisamos do token
      const user_id = request.user.id;

      const { name, email, old_password, password } = request.body;

      const updateProfile = container.resolve(UpdateProfileService);

      //Realizando uma chamada autenticada
      const user = await updateProfile.execute({
        user_id,
        name,
        email,
        old_password,
        password,
      });

      return response.json(classToClass(user));
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }
}

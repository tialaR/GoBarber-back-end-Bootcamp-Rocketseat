import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ApponitmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    //Id do usuário setado de forma automática pelo midleware de autenticação.
    /* Sempre q/ uma rota autenticada setamos essa variável e
    com isso conseguimos recuperar ela em qualuqe rota */
    const user_id = request.user.id;

    const { provider_id, date } = request.body;

    // Instanciando o service CreateAppointmentService:
    //Repositório de appointmemnts injetado de forma automática pelo container
    const createAppointmentService = container.resolve(CreateAppointmentService);

    const appointment = await createAppointmentService.execute({
      provider_id,
      user_id,
      date,
    });

    return response.json(appointment);
  }
}

/* Contorler responsável pela listagem dos agendamentos
de um prestador de serviços específico */
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentscontroller {
  public async index(request: Request, response: Response): Promise<Response> {
    //Recuperando usuário logado:
    const provider_id = request.user.id;

    const { day, month, year } = request.query;

    // Instanciando o service CreateAppointmentService:
    //Repositório de appointmemnts injetado de forma automática pelo container
    const listProviderAppointmentsService = container.resolve(ListProviderAppointmentsService);

    const appointments = await listProviderAppointmentsService.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(classToClass(appointments));
  }
}

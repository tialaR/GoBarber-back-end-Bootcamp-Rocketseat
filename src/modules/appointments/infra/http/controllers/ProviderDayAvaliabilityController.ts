import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProviderDayAvaliabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;

    //Recuperando data de agendamento e quem fez
    const { day, month, year } = request.query;

    // Instanciando o service ListProviderDayAvailabilityService:
    const listProviderDayAvailabilityService = container.resolve(ListProviderDayAvailabilityService);

    //Lista de agendamentos de um prestador específico no dia
    const availability = await listProviderDayAvailabilityService.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}

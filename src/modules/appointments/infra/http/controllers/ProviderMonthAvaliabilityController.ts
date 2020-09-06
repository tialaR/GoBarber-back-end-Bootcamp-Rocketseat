import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProviderMonthAvaliabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;

    //Recuperando data de agendamento e quem fez
    const { month, year } = request.query;

    // Instanciando o service ListProviderMonthAvailabilityService:
    const listProviderMonthAvailabilityService = container.resolve(ListProviderMonthAvailabilityService);

    //Lista de agendamentos de um prestador específico no mês
    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}

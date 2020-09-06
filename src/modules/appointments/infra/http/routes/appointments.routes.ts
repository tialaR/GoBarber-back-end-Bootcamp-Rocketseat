// Arquivo de rotas para AGENDAMENTOS

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import ApponitmentsController from '../controllers/ApponitmentsController';
import ProviderAppointmentscontroller from '../controllers/ProviderAppointmentscontroller';

const appointmentsRouter = Router();
const apponitmentsController = new ApponitmentsController();
const providerAppointmentscontroller = new ProviderAppointmentscontroller();

// Middleware aplicado em todas as rotas para recuperar id do usuário logado:
// É preciso estar logado para criar um agendamento
appointmentsRouter.use(ensureAuthenticated);

// Cadastrar Appointments:
appointmentsRouter.post('/',celebrate({
  [Segments.BODY]: {
    provider_id: Joi.string().uuid().required(),
    date: Joi.date(),
  }
}), apponitmentsController.create);

//Lista dos agendamentos em um dia específico de um prestador de serviço:
appointmentsRouter.get('/me', providerAppointmentscontroller.index);

export default appointmentsRouter;

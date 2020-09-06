// Arquivo de rotas para LISTAGEM DE PRESTADORES DE SERVIÇO
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import ProviderDayAvaliabilityController from '../controllers/ProviderDayAvaliabilityController';
import ProviderMonthAvaliabilityController from '../controllers/ProviderMonthAvaliabilityController';
import ProvidersController from '../controllers/ProvidersController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerDayAvaliabilityController = new ProviderDayAvaliabilityController();
const providerMonthAvaliabilityController = new ProviderMonthAvaliabilityController();

// Middleware aplicado em todas as rotas para recuperar id do usuário logado:
// É preciso estar logado para listar os prestadores de serviço
providersRouter.use(ensureAuthenticated);

// listar providers:
providersRouter.get('/', providersController.index);

//localhost:3333/providers/:provider_id/month-availability
//Lista de dias disponíveis e não disponíveis no mês:
providersRouter.get('/:provider_id/month-availability',
celebrate({
  [Segments.PARAMS]: {
    provider_id: Joi.string().uuid().required()
   }
}),
providerMonthAvaliabilityController.index);

//localhost:3333/providers/:provider_id/day-availability
//Lista dos horarios disponíveis e não disponíveis no dia:
providersRouter.get('/:provider_id/day-availability',
celebrate({
  [Segments.PARAMS]: {
    provider_id: Joi.string().uuid().required()
   }
}),
providerDayAvaliabilityController.index);

export default providersRouter;

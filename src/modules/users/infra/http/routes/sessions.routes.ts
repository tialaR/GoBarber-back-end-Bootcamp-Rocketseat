// Arquivo de rotas para USERS

import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import SessionsController from '../controllers/SessionsControllers';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

// Criar Sessão (Autenticação Usuário):
sessionsRouter.post('/', celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }
}), sessionsController.create);

export default sessionsRouter;

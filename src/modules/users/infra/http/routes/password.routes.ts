// Arquivo de rotas para Recuperação de senha

import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

/* Rota que vai lhe dar com envio de e-mail de reset de senha para
 o usuário que a requisitou: */
passwordRouter.post('/forgot', celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required()
  }
}), forgotPasswordController.create);

/* Rota que vai lhe dar com o reset da senha (alteração para a nova senha) */
passwordRouter.post('/reset', celebrate({
  [Segments.BODY]: {
    token: Joi.string().uuid().required(),
    password: Joi.string().required(),
    password_confirmation: Joi.string().required().valid(Joi.ref('password'))
  }
}), resetPasswordController.create);

export default passwordRouter;

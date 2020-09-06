// Arquivo de rotas para Profile do usuário
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

/* Com esse middlawere as rotas de perfil só serão acessíveis de o
usuário estiver logado. E as que são acessíveis vais ser possível obter
o id do usuário logado através do request.user.id */
profileRouter.use(ensureAuthenticated);

//Mostrar perfil do usuário:
profileRouter.get('/', profileController.show);
// Alterar Profile do usuário logado:
profileRouter.put('/', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    old_password: Joi.string(),
    password: Joi.string(),
    password_confirmation: Joi.string().valid(Joi.ref('password'))
  }
}), profileController.update);

export default profileRouter;

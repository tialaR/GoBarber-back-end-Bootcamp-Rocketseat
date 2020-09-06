// Arquivo de rotas para USERS

import uploadConfig from '@config/upload';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';
import UserAvatarController from '../controllers/UserAvatarController';
import UsersController from '../controllers/UsersControllers';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig.multer); // Instanciando o multer
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

// Cadastrar Users:
usersRouter.post('/', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }
}), usersController.create);

// Avatar -> atualizando inserindo avatar
// Para alterar o avatar o usuário precisa estar logado
usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'), userAvatarController.update);

export default usersRouter;

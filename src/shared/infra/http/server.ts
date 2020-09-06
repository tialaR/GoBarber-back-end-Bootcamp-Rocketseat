import 'reflect-metadata';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimeter';
import routes from './routes';

import '@shared/infra/typeorm'; // Criando conexão com o Banco
import '@shared/container'; //Injeção de dependência

const app = express();

app.use(cors());

app.use(express.json());
// Rota para vizualizar arquivos de imagens salvas na aplicação -> (http://localhost:3333/files/6a0d3cc2537735cfb8ee-tico.jpeg)
app.use('/files', express.static(uploadConfig.uploadsFolder));

// O rateLimiter deve ficar após as rotas files pois não se aplicarão a elas (vai ser aplicado em todas as rotas menos na rota de files)
app.use(rateLimiter);

app.use(routes);

app.use(errors());

// Tratativa global dos erros da nossa aplicação
/*
Middleware que vai fazer a tratativa de erro de todas as rotas da aplicação
 tratando todos os erros da aplicação de forma global)
Os middlewares para tratativas de erro no express são obrigados a ter 4 parâmetros */
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      /* Se o erro em questão for uma instancia da minha classe AppError,
     quer dizer que foi um erro originado da minha aplicação -> erro conhecido */
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    console.error(err);

    // Se for um erro que minha aplicação não conhece envio um erro mais genérico:
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3333, () => {
  console.log('👽 Server started on port 3333!');
});

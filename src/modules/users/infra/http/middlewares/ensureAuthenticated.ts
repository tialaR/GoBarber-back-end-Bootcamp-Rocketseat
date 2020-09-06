import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

// MIDDLEWARE QUE VERIFICA SE O USUÁRIO ESTÁ AUTENTICADO

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // Validação do token JWT

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing.', 401);
  }

  const [, token] = authHeader.split(' ');

  // Verificando se o token é válido
  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    /* Estabelecendo que o id do usuário autenticado estará em todas
     as proximas requests dessa rota */
    /* Teremos acesso ao id do usuário em todas as rotas que
    são autenticadas -> console.log(request.user)
    */
    request.user = {
      id: sub,
    };

    // Token válido -> Deixar o usuário continuar com o fluxo da aplicação
    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}

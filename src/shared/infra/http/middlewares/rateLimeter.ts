import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';
import AppError from '@shared/errors/AppError';

//Criando cliente
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

//Configuração do RateLimiter
const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 5, // 5 requisições por IP
  duration: 1, //Dentro do período de 1s
})

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
  ): Promise<void> {
    try {
      await limiter.consume(request.ip);

      //Caso dê tudo certo deixo continuar:
      return next()
    } catch (err) {
      // caso contrário
      throw new AppError('To many requests', 429);
    }
}

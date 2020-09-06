import ICacheProvider from '../models/ICacheProvider';
import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void>{
    //Salvando informação dentro do redis:
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null>{
    //Buscando informação dentro do redis:
    const data = await this.client.get(key);

    if(!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;
    return parsedData;
  }

  public async invalidate(key: string): Promise<void>{
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void>{
    //Buscando todos os caches que iniciam com o prefixo passado:
    const keys = await this.client.keys(`${prefix}:*`);

    /* pipeline -> Mais performático quando queremos realizar multiplas
    operações ao mesmo tempo */
    const pipeline = this.client.pipeline();

    //Fazendo todos os delets ao mesmo tempo
    keys.forEach(key => {
      pipeline.del(key);
    });

    // console.log('Deletou do cache.');

    //Fazendo todos os delets ao mesmo tempo
    await pipeline.exec();
  }

}

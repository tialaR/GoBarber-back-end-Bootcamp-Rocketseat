import { container } from 'tsyringe';
import ICacheProvider from './models/ICacheProvider';
import RedisCacheProvider from './implementations/RedisCacheProvider';

//Arquivo que contem tudo que for referente a configuração do provedor de cache

const providers = {
  redis: RedisCacheProvider,
};

container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  providers.redis,
);



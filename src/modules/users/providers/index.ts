//Configurando Injeção de dependências para o módulo de usuários:

import { container } from 'tsyringe';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';
import IHashProvider from './HashProvider/models/IHashProvider';

/* Toda vez que tiver uma injeção de dependência com o nome HashProvider
eu vou retornar uma instaância da classe BCryptHashProvider */
container.registerSingleton<IHashProvider>(
  'HashProvider',
  BCryptHashProvider
)


import { container } from 'tsyringe';
import uploadConfig from '@config/upload';
import IStorageProvider from './models/IStorageProvider';
import DisckStorageProvider from './implementations/DiskStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';

//Arquivo que contem tudo que for referente a configuração do provedor de storage

const providers = {
  disk: DisckStorageProvider,
  s3: S3StorageProvider,
};

//Escolhendo o driver baseado no que está sendo usado no uploadConfig
//Retorna disk ou s3 baseado na configuração feita no arquivo .env
container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);

/* singleton -> vai executar o código que está dentro da classe DisckStorageProvider uma
única vez

registerInstance -> Cria uma instância da classe EtherialMailProvider -> O node
trata esssa instância da classe como um singleton, ou seja, esse código só será
executado uma vez.
*/


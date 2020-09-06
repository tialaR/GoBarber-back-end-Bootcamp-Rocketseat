/* Em ambiente desenvolvimento vamos salvar os arquivos em disco local,
ou seja, na máquina -> Depois para jogar em produção vamos armazenar
esses arquivos em outro serviço como o Amazon, etc...
*/

import uploadConfig from '@config/upload';
import fs from 'fs';
import path from 'path';
import IStorageProvider from '../models/IStorageProvider';

class DisckStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    /* Movendo arquivo da pasta tmp para a pasta uploads para simular a
    efetivação de um download: (isso serve para depois efetivarmos a movimentação
      do arquivo da pasta tmp para um serviço externo como o AmazonS3) */
      await fs.promises.rename(
        path.resolve(uploadConfig.tmpFolder, file),
        path.resolve(uploadConfig.uploadsFolder ,file),
      );

      return file;
  }

  public async deleteFile(file: string): Promise<void> {
    //Pegando caminho completo do arquivo que deseja deletar
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    //Verificando se arquivo existe:
    try {
      await fs.promises.stat(filePath)
    } catch {
      //Caso o arquivo não seja encontrado paro a execução da função
      return;
    }

    //Caso o arquivo exista deleto ele:
    await fs.promises.unlink(filePath);
  }
}

export default DisckStorageProvider;

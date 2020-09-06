/* Em ambiente de produção vamos salvar os arquivos no serviço AmazonS3 */

import uploadConfig from '@config/upload';
import fs from 'fs';
import path from 'path';
import IStorageProvider from '../models/IStorageProvider';
import aws, { S3 } from 'aws-sdk';
import mime from 'mime';

class S3torageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  //Salvando arquivo de imagem no AmazonS3
  public async saveFile(file: string): Promise<string> {
      //Pegando o caminho exato do arquivo dentro da pasta tmp:
      const originalPath = path.resolve(uploadConfig.tmpFolder, file);

      //Recuperando o tipo da imagem (png, jpg, etc...)
      const ContentType = mime.getType(originalPath);

      //ContentType pode existir ou não
      if(!ContentType) {
        throw new Error('File not found');
      }

      //Lendo todo o conteúdo do arquivo:
      const fileContent = await fs.promises.readFile(originalPath);

      //Salvando arquivo de imagem no AmazonS3
      await this.client.putObject({
        Bucket: uploadConfig.config.aws.bucket, //Nome do bucket q/ registramos no AmazonS3
        Key: file,  //Nome do arquivo
        ACL: 'public-read', /* Permisões que vamos dar p/ nosso arquivo
        (nesse caso determinamos que ele será legivel publicamente -> Público) */
        Body: fileContent, //Conteúdo do arquivo
        ContentType, //Tipo do arquivo
      }).promise();

      //Deletando o arquivo de imagem após salva-lo no nosso bucket do amazonS3
      await fs.promises.unlink(originalPath);

      //Retornamos o nome do arquivo que salvamos
      return file;
  }

  //Excluindo arquivo de imagem no AmazonS3
  public async deleteFile(file: string): Promise<void> {
    await this.client.deleteObject({
      Bucket: uploadConfig.config.aws.bucket, //Nome do bucket q/ registramos no AmazonS3
      Key: file,  //Nome do arquivo
    }).promise();
  }
}

export default S3torageProvider;

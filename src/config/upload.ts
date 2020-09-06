import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';

  tmpFolder: string;
  uploadsFolder: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: {};
    aws: {
      bucket: string;
    }
  }
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  //Config específica para o Multer:
  multer: {
    storage: multer.diskStorage({
      // Onde as imagens serão salvas
      destination: tmpFolder,
      // Nome do arquivo:
      filename(req, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('HEX');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },

  //Config específica para o AmazonS3:
  config: {
    disk: {},
    aws: {
      bucket: 'appgobarbertiala'
    }
  }
} as IUploadConfig;

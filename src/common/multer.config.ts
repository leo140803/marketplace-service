import { memoryStorage } from 'multer';
import { HttpException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

export const multerConfigForStoreLogo = {
  storage: memoryStorage(),
  fileFilter: (req, file, callback) => {
    console.log('MASUK INTER');
    if (!file.mimetype.startsWith('image/')) {
      return callback(new HttpException('File not allowed!', 400), false);
    }
    callback(null, true);
  },
};

export const ImageFileInterceptorForStoreLogo = () =>
  FileInterceptor('image', multerConfigForStoreLogo);

import { NextFunction, Request } from 'express';
import multer, { diskStorage } from 'multer';
import { newError } from '../utils/helper';
import { ExtendedResponse } from '../types/express';
import { mkdirSync, unlinkSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import jimp from 'jimp';

const MIME_TYPE_MAP: { [key: string]: string } = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
};

export const storage = diskStorage({
  destination: (req, file, cb) => {
    const path = './data/images';
    mkdirSync(path, { recursive: true });

    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = null;
    if (!isValid)
      error = newError(400, 'ประเภทของไฟล์ไม่ถูกต้อง (png, jpg, jpeg)');

    cb(error, path);
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    const fileName = `${uuidv4()}.${ext}`;

    cb(null, fileName);
  },
});

export const setFuncName = (
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) => {
  res.locals.func = 'uploadMiddleware';
  next();
};

export const upload = multer({ storage }).single('image');

export async function reduceQualityImage(
  req: Request<unknown>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'reduceQualityImage';
  try {
    if (req.file) {
      const filePath = req.file.path;
      const fileName = `reduce-${req.file.filename}`;
      const fileImage = `${req.file.destination}/${fileName}`;

      res.locals.image = [];
      res.locals.image.push(filePath);
      res.locals.image.push(fileImage);

      const file = await jimp.read(filePath);
      file.quality(80).write(fileImage);
      unlinkSync(filePath);

      req.body.image = fileName;
    }
    next();
  } catch (error) {
    next(error);
  }
}

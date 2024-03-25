import { NextFunction, Request } from 'express';
import multer, { diskStorage } from 'multer';
import { newError } from '../utils/helper';
import { ExtendedResponse } from '../types/express';
import { mkdirSync, unlinkSync } from 'fs';
import sharp from 'sharp';

const MIME_TYPE_MAP: { [key: string]: string } = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
};

export const storage = diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    const path = './public/images';
    let error = null;

    mkdirSync(path, { recursive: true });
    if (!isValid)
      error = newError(400, 'ประเภทของไฟล์ไม่ถูกต้อง (png, jpg, jpeg)');

    cb(error, path);
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .replace(/\.[^.]+$/, '') // ตัดนามสกุลไฟล์ออก
      .replace(/\s+/g, '-'); // แทนที่ช่องว่างด้วยขีด
    const ext = MIME_TYPE_MAP[file.mimetype];
    const fileName = `${name}-${Date.now()}.${ext}`;
    req.body.image = fileName;

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
      const fileName = `resize-${req.file.filename}`;
      const fileImage = `${req.file.destination}/resize-${fileName}`;

      await sharp(filePath).jpeg({ quality: 80 }).toFile(fileImage);
      unlinkSync(filePath);
      req.body.image = fileName;
    }
    next();
  } catch (error) {
    next(error);
  }
}

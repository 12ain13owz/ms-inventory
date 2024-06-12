import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { existsSync, unlinkSync } from 'fs';
import log from '../utils/logger';

interface ResponseError extends Error {
  status?: number;
  logout?: boolean;
}

const errorHandler = async (
  error: ResponseError,
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) => {
  try {
    const message = error.message || 'Internal Server Error!';
    const status = error.status || 500;
    const logout = error.logout || false;
    const func = res.locals.func || 'โunction not found ';
    const url = req.method + req.baseUrl + req.url;
    const image = res.locals.image || [];

    for (let i = 0; i < image.length; i++) {
      if (existsSync(image[i])) unlinkSync(image[i]);
    }

    log.error(`${url}, ${func}: ${message}`);
    res.status(status).json({ message, logout });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default errorHandler;

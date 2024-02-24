import { NextFunction, Request, Response } from 'express';
import log from '../utils/logger';

interface ResponseError extends Error {
  status?: number;
}

const errorHandler = async (
  error: ResponseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const message = error.message || 'Internal Server Error!';
    const status = error.status || 500;
    const func = res.locals.func || 'Not found function';
    const url = req.method + req.baseUrl + req.url;

    log.error(`${url}, ${func}: ${message}`);
    res.status(status).json({ message });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default errorHandler;

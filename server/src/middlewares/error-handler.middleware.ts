import { NextFunction, Request, Response } from 'express';
import log from '../utils/logger';

interface ResponseError extends Error {
  status?: number;
  logout?: boolean;
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
    const logout = error.logout || false;
    const func = res.locals.func || 'Not found function';
    const url = req.method + req.baseUrl + req.url;

    log.error(`${url}, ${func}: ${message}`);
    res.status(status).json({ message, logout });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default errorHandler;

import { NextFunction, Request, Response } from 'express';

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.func = 'loginHandler';
  try {
    res.json({ message: 'ok' });
  } catch (error) {
    next(error);
  }
}

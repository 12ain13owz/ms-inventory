import { NextFunction, Request, Response } from 'express';
import { findAllUser } from '../services/user.service';

export async function getAllUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.func = 'getAllUserHandler';

  try {
    const users = await findAllUser();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

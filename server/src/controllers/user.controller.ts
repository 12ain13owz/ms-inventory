import { NextFunction, Request, Response } from 'express';
import { findAllUser, findUserById } from '../services/user.service';
import { getUserInput } from '../schemas/user.schema';
import { newError } from '../utils/error';
import { omit } from 'lodash';
import { privateUserFields } from '../models/user.model';

export async function getUserHandeler(
  req: Request<getUserInput>,
  res: Response,
  next: NextFunction
) {
  res.locals.func = 'getUserHandeler';

  try {
    const user = await findUserById(req.params.id);
    if (!user) throw newError(404, 'ไม่พบข้อมูลผู้ใช้งานในระบบ', true);

    const payload = omit(user.dataValues, privateUserFields);
    res.json(payload);
  } catch (error) {
    next(error);
  }
}

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

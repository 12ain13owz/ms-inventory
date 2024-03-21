import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { findAllLog } from '../services/log.service';

export async function getAllLogHandler(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getAllLogHandler';

  try {
    const payload = await findAllLog();
    res.json(payload);
  } catch (error) {
    next(error);
  }
}

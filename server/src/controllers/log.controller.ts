import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import {
  findAllLog,
  findLimitLog,
  findLogByCode,
  findLogByDate,
  findLogById,
  findLogByTrack,
} from '../services/log.service';
import {
  getLogByCodeInput,
  getLogByDateInput,
  getLogByIdInput,
  getLogByTrackInput,
} from '../schemas/log.schema';
import { newError, removeWhitespace } from '../utils/helper';

export async function getAllLogHandler(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getAllLogHandler';

  try {
    const resLogs = await findAllLog();
    res.json(resLogs);
  } catch (error) {
    next(error);
  }
}

export async function getInitialLogHandler(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getInitialLogHandler';

  try {
    const logs = await findLimitLog(50);
    const resLogs = logs.sort((a, b) => a.id - b.id);

    res.json(resLogs);
  } catch (error) {
    next(error);
  }
}

export async function getLogByDateHandler(
  req: Request<getLogByDateInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getLogByDateHandler';

  try {
    const dateStart = new Date(req.params.dateStart);
    const dateEnd = new Date(req.params.dateEnd);

    if (isNaN(dateStart.getTime()) || isNaN(dateEnd.getTime()))
      throw newError(400, 'รูปแบบวันที่ไม่ถูกต้อง');

    dateStart.setHours(0, 0, 0, 0);
    dateEnd.setHours(23, 59, 59, 999);

    const resLogs = await findLogByDate(dateStart, dateEnd);
    res.json(resLogs);
  } catch (error) {
    next(error);
  }
}

export async function getLogByTrackHandler(
  req: Request<getLogByTrackInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getLogByTrackHandler';

  try {
    const track = removeWhitespace(req.params.track);
    const resLogs = await findLogByTrack(track);

    res.json(resLogs);
  } catch (error) {
    next(error);
  }
}

export async function getLogByCodeHandler(
  req: Request<getLogByCodeInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getLogByCodeHandler';

  try {
    const code = removeWhitespace(req.params.code);
    const resLogs = await findLogByCode(code);

    res.json(resLogs);
  } catch (error) {
    next(error);
  }
}

export async function getLogByIdHandler(
  req: Request<getLogByIdInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getLogByIdHandler';

  try {
    const id = +req.params.id;
    const resLog = await findLogById(id);

    res.json(resLog);
  } catch (error) {
    next(error);
  }
}

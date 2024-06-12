import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { newError, removeWhitespace } from '../utils/helper';
import { logService } from '../services/log.service';
import { LogType } from '../schemas/log.schema';

export async function searchLogByCodeController(
  req: Request<{}, {}, {}, LogType['search']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'searchLogByCodeController';

  try {
    const query = removeWhitespace(req.query.code);
    const resLogs = await logService.searchByCode(query);

    res.json(resLogs);
  } catch (error) {
    next(error);
  }
}

export async function initialLogController(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'initialLogController';

  try {
    const logs = await logService.findLimit(50);
    const resLogs = logs.sort((a, b) => a.id - b.id);

    res.json(resLogs);
  } catch (error) {
    next(error);
  }
}

export async function findAllLogController(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findAllLogController';

  try {
    const resLogs = await logService.findAll();
    res.json(resLogs);
  } catch (error) {
    next(error);
  }
}

export async function findLogByDateController(
  req: Request<LogType['findByDate']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findLogByDateController';

  try {
    const dateStart = new Date(req.params.dateStart);
    const dateEnd = new Date(req.params.dateEnd);

    if (isNaN(dateStart.getTime()) || isNaN(dateEnd.getTime()))
      throw newError(400, 'รูปแบบวันที่ไม่ถูกต้อง');

    dateStart.setHours(0, 0, 0, 0);
    dateEnd.setHours(23, 59, 59, 999);

    const resLogs = await logService.findByDate(dateStart, dateEnd);
    res.json(resLogs);
  } catch (error) {
    next(error);
  }
}

export async function findLogByTrackController(
  req: Request<LogType['findByTrack']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findLogByTrackController';

  try {
    const track = removeWhitespace(req.params.track);
    const resLogs = await logService.findByTrack(track);

    res.json(resLogs);
  } catch (error) {
    next(error);
  }
}

export async function findLogByCodeController(
  req: Request<LogType['findByCode']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findLogByCodeController';

  try {
    const code = removeWhitespace(req.params.code);
    const resLogs = await logService.findByCode(code);

    res.json(resLogs);
  } catch (error) {
    next(error);
  }
}

export async function findLogByIdController(
  req: Request<LogType['findById']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findLogByIdController';

  try {
    const id = +req.params.id;
    const resLog = await logService.findById(id);

    res.json(resLog);
  } catch (error) {
    next(error);
  }
}

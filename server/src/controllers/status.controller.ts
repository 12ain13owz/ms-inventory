import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { omit } from 'lodash';
import { newError, privateFields, removeWhitespace } from '../utils/helper';
import { Status } from '../models/status.model';
import {
  createStatus,
  deleteStatus,
  findAllStatus,
  findStatusByName,
  updateStatus,
} from '../services/status.service';
import {
  createStatusInput,
  deleteStatusInput,
  updateStatusInput,
} from '../schemas/status.schema';

export async function getAllStatusHandler(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getAllStatusHandler';

  try {
    const payload = await findAllStatus();
    res.json(payload);
  } catch (error) {
    next(error);
  }
}

export async function createStatusHandler(
  req: Request<{}, {}, createStatusInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'createStatusHandler';

  try {
    const name = removeWhitespace(req.body.name);
    const status = await findStatusByName(name);
    if (status) throw newError(400, 'ชื่อสถานะอุปกรณ์ซ้ำ');

    const payload = new Status({
      name: name,
      place: req.body.place || '',
      active: req.body.active,
      remark: req.body.remark || '',
    });
    const result = await createStatus(payload);
    const newStatus = omit(result.dataValues, privateFields);

    res.json({
      message: 'เพิ่มสถานะอุปกรณ์สำเร็จ',
      status: newStatus,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStatusHandler(
  req: Request<{}, {}, updateStatusInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateStatusHandler';

  try {
    const name = removeWhitespace(req.body.name);
    const status = await findStatusByName(name);
    if (status && status.id !== req.body.id)
      throw newError(400, 'ชื่อสถานะอุปกรณ์ซ้ำ');

    const payload: Partial<Status> = {
      name: name,
      place: req.body.place || '',
      active: req.body.active,
      remark: req.body.remark || '',
    };

    const result = await updateStatus(req.body.id, payload);
    if (!result[0]) throw newError(400, 'อัพเดทสถานะอุปกรณ์ไม่สำเร็จ');

    res.json({ message: 'อัพเดทสถานะอุปกรณ์สำเร็จ' });
  } catch (error) {
    next(error);
  }
}

export async function deleteStatudHandler(
  req: Request<deleteStatusInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'deleteStatudHandler';

  try {
    const result = await deleteStatus(req.params.id);
    if (!result) throw newError(400, 'ลบสถานะอุปกรณ์ไม่สำเร็จ');

    res.json({ message: 'ลบสถานะอุปกรณ์สำเร็จ' });
  } catch (error) {
    next(error);
  }
}

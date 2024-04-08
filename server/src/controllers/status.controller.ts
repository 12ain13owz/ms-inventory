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
  CreateStatusInput,
  DeleteStatusInput,
  UpdateStatusInput,
} from '../schemas/status.schema';

export async function getAllStatusHandler(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getAllStatusHandler';

  try {
    const statuses = await findAllStatus();
    res.json(statuses);
  } catch (error) {
    next(error);
  }
}

export async function createStatusHandler(
  req: Request<{}, {}, CreateStatusInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'createStatusHandler';

  try {
    const name = removeWhitespace(req.body.name);
    const status = await findStatusByName(name);
    if (status) throw newError(400, `ชื่อสถานะพัสดุ ${name} ซ้ำ`);

    const payload = new Status({
      name: name,
      active: req.body.active,
      remark: req.body.remark || '',
    });
    const result = await createStatus(payload);
    const newStatus = omit(result.toJSON(), privateFields);

    res.json({
      message: `เพิ่มสถานะพัสดุ ${name} สำเร็จ`,
      status: newStatus,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStatusHandler(
  req: Request<UpdateStatusInput['params'], {}, UpdateStatusInput['body']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateStatusHandler';

  try {
    const id = +req.params.id;
    const name = removeWhitespace(req.body.name);
    const existingStatus = await findStatusByName(name);

    if (existingStatus && existingStatus.id !== id)
      throw newError(400, `ชื่อสถานะพัสดุ ${name} ซ้ำ`);

    const payload: Partial<Status> = {
      name: name,
      active: req.body.active,
      remark: req.body.remark || '',
    };
    const result = await updateStatus(id, payload);
    if (!result[0]) throw newError(400, `แก้ไขสถานะพัสดุ ${name} ไม่สำเร็จ`);

    res.json({ message: `แก้ไขสถานะพัสดุ ${name} สำเร็จ`, status: payload });
  } catch (error) {
    next(error);
  }
}

export async function deleteStatudHandler(
  req: Request<DeleteStatusInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'deleteStatudHandler';

  try {
    const id = +req.params.id;
    // const status = await find

    const result = await deleteStatus(+req.params.id);
    if (!result) throw newError(400, 'ลบสถานะพัสดุไม่สำเร็จ');

    res.json({ message: 'ลบสถานะอุปกรณ์สำเร็จ' });
  } catch (error) {
    next(error);
  }
}

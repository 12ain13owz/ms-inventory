import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { omit } from 'lodash';
import { newError, privateFields, removeWhitespace } from '../utils/helper';
import { Status } from '../models/status.model';
import { StatusType } from '../schemas/status.schema';
import { statusService } from '../services/status.service';

export async function findAllStatusController(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findAllStatusController';

  try {
    const statuses = await statusService.findAll();
    res.json(statuses);
  } catch (error) {
    next(error);
  }
}

export async function createStatusController(
  req: Request<{}, {}, StatusType['create']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'createStatusController';

  try {
    const name = removeWhitespace(req.body.name);
    const status = await statusService.findByName(name);
    if (status) throw newError(400, `สถานะ ${name} ซ้ำ`);

    const payload = new Status({
      name: name,
      active: req.body.active,
      remark: req.body.remark || '',
    });
    const result = await statusService.create(payload);
    const newStatus = omit(result.toJSON(), privateFields);

    res.json({
      message: `เพิ่มสถานะ ${name} สำเร็จ`,
      item: newStatus,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStatusController(
  req: Request<
    StatusType['update']['params'],
    {},
    StatusType['update']['body']
  >,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateStatusController';

  try {
    const id = +req.params.id;
    const status = await statusService.findById(id);
    if (!status) throw newError(400, 'ไม่พบสถานะ');

    const name = removeWhitespace(req.body.name);
    const existingStatus = await statusService.findByName(name);
    if (existingStatus && existingStatus.id !== id)
      throw newError(400, `ชื่อสถานะ ${name} ซ้ำ`);

    const payload: Partial<Status> = {
      name: name,
      active: req.body.active,
      remark: req.body.remark || '',
    };
    const [result] = await statusService.update(id, payload);
    if (!result) throw newError(400, `แก้ไขสถานะ ${name} ไม่สำเร็จ`);

    res.json({
      message: `แก้ไขสถานะ ${name} สำเร็จ`,
      item: payload,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteStatusController(
  req: Request<StatusType['delete']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'deleteStatusController';

  try {
    const id = +req.params.id;
    const status = await statusService.findById(id);
    if (!status) throw newError(400, 'ไม่พบสถานะ');

    const name = status.name;
    const result = await statusService.delete(id);
    if (!result) throw newError(400, `ลบสถานะ ${name} ไม่สำเร็จ`);

    res.json({ message: `ลบสถานะ ${name} สำเร็จ` });
  } catch (error) {
    next(error);
  }
}

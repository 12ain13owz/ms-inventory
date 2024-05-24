import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { omit } from 'lodash';
import { newError, privateFields, removeWhitespace } from '../utils/helper';
import { UsageStatus } from '../models/usage-status.model';
import { UsageStatusType } from '../schemas/usage-status.schema';
import { usageStatusService } from '../services/usage-status.service';

export async function findAllUsageController(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findAllUsageController';

  try {
    const usageStatuses = await usageStatusService.findAll();
    res.json(usageStatuses);
  } catch (error) {
    next(error);
  }
}

export async function createUsageStatusController(
  req: Request<{}, {}, UsageStatusType['create']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'createUsageStatusController';

  try {
    const name = removeWhitespace(req.body.name);
    const usageStatus = await usageStatusService.findByName(name);
    if (usageStatus) throw newError(400, `สถานะครุภัณฑ์ ${name} ซ้ำ`);

    const payload = new UsageStatus({
      name: name,
      active: req.body.active,
      remark: req.body.remark || '',
    });
    const result = await usageStatusService.create(payload);
    const newUsageStatus = omit(result.toJSON(), privateFields);

    res.json({
      message: `เพิ่มสถานะครุภัณฑ์ ${name} สำเร็จ`,
      usageStatus: newUsageStatus,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUsageStatusController(
  req: Request<
    UsageStatusType['update']['params'],
    {},
    UsageStatusType['update']['body']
  >,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateUsageStatusController';

  try {
    const id = +req.params.id;
    const name = removeWhitespace(req.body.name);
    const existingAssetStatus = await usageStatusService.findByName(name);

    if (existingAssetStatus && existingAssetStatus.id !== id)
      throw newError(400, `ชื่อสถานะครุภัณฑ์ ${name} ซ้ำ`);

    const payload: Partial<UsageStatus> = {
      name: name,
      active: req.body.active,
      remark: req.body.remark || '',
    };
    const [result] = await usageStatusService.update(id, payload);
    if (!result) throw newError(400, `แก้ไขสถานะครุภัณฑ์ ${name} ไม่สำเร็จ`);

    res.json({
      message: `แก้ไขสถานะครุภัณฑ์ ${name} สำเร็จ`,
      usageStatus: payload,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUsageStatusController(
  req: Request<UsageStatusType['delete']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'deleteUsageStatusController';

  try {
    const id = +req.params.id;
    const usageStatus = await usageStatusService.findById(id);
    if (!usageStatus) throw newError(400, 'ไม่พบสถานะครุภัณฑ์');

    const name = usageStatus.name;
    const result = await usageStatusService.delete(id);
    if (!result) throw newError(400, `ลบสถานะครุภัณฑ์ ${name} ไม่สำเร็จ`);

    res.json({ message: `ลบสถานะครุภัณฑ์ ${name} สำเร็จ` });
  } catch (error) {
    next(error);
  }
}

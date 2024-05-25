import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { omit } from 'lodash';
import { newError, privateFields, removeWhitespace } from '../utils/helper';
import { Usage } from '../models/usage.model';
import { UsageType } from '../schemas/usage.schema';
import { usageService } from '../services/usage.service';

export async function findAllUsageController(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findAllUsageController';

  try {
    const usages = await usageService.findAll();
    res.json(usages);
  } catch (error) {
    next(error);
  }
}

export async function createUsageController(
  req: Request<{}, {}, UsageType['create']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'createUsageController';

  try {
    const name = removeWhitespace(req.body.name);
    const usage = await usageService.findByName(name);
    if (usage) throw newError(400, `สถานะครุภัณฑ์ ${name} ซ้ำ`);

    const payload = new Usage({
      name: name,
      active: req.body.active,
      remark: req.body.remark || '',
    });
    const result = await usageService.create(payload);
    const newUsage = omit(result.toJSON(), privateFields);

    res.json({
      message: `เพิ่มสถานะครุภัณฑ์ ${name} สำเร็จ`,
      usage: newUsage,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUsageController(
  req: Request<UsageType['update']['params'], {}, UsageType['update']['body']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateUsageController';

  try {
    const id = +req.params.id;
    const name = removeWhitespace(req.body.name);
    const existingUsage = await usageService.findByName(name);

    if (existingUsage && existingUsage.id !== id)
      throw newError(400, `ชื่อสถานะครุภัณฑ์ ${name} ซ้ำ`);

    const payload: Partial<Usage> = {
      name: name,
      active: req.body.active,
      remark: req.body.remark || '',
    };
    const [result] = await usageService.update(id, payload);
    if (!result) throw newError(400, `แก้ไขสถานะครุภัณฑ์ ${name} ไม่สำเร็จ`);

    res.json({
      message: `แก้ไขสถานะครุภัณฑ์ ${name} สำเร็จ`,
      usage: payload,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUsageController(
  req: Request<UsageType['delete']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'deleteUsageController';

  try {
    const id = +req.params.id;
    const usage = await usageService.findById(id);
    if (!usage) throw newError(400, 'ไม่พบสถานะครุภัณฑ์');

    const name = usage.name;
    const result = await usageService.delete(id);
    if (!result) throw newError(400, `ลบสถานะครุภัณฑ์ ${name} ไม่สำเร็จ`);

    res.json({ message: `ลบสถานะครุภัณฑ์ ${name} สำเร็จ` });
  } catch (error) {
    next(error);
  }
}

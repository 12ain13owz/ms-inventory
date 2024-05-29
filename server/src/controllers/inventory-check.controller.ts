import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { inventoryCheckService } from '../services/inventory-check.service';
import { InventoryCheckType } from '../schemas/inventory-check.schema';
import { InventoryCheck } from '../models/inventory-check.model';

export async function findAllInventoryCheckController(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findAllInventoryCheckController';

  try {
    const resInventoriesCheck = await inventoryCheckService.findAll();
    res.json(resInventoriesCheck);
  } catch (error) {
    next(error);
  }
}

export async function findInventoryCheckByYearController(
  req: Request<InventoryCheckType['findByYear']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findInventoryCheckByYearController';

  try {
    const year = +req.params.year;
    const resInventoryCheck = await inventoryCheckService.findByYear(year);
    res.json(resInventoryCheck);
  } catch (error) {
    next(error);
  }
}

export async function findInventoryCheckByIdController(
  req: Request<InventoryCheckType['findById']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findInventoryCheckByIdController';

  try {
    const id = +req.params.id;
    const resInventoryCheck = await inventoryCheckService.findById(id);
    res.json(resInventoryCheck?.toJSON());
  } catch (error) {
    next(error);
  }
}

export async function createInventoryCheckController(
  req: Request<{}, {}, InventoryCheckType['create']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  try {
    const inventoryId = req.body.inventoryId;
    const currentYear = new Date().getFullYear();
    const inventoryCheck = await inventoryCheckService.findByInventoryId(
      inventoryId,
      currentYear
    );

    if (inventoryCheck)
      return res.json({
        message: 'ตรวจสอบครุภัณฑ์ สำเร็จ',
        item: inventoryCheck.toJSON(),
      });

    const payload = new InventoryCheck({ inventoryId, year: currentYear });
    const result = await inventoryCheckService.create(payload);
    const resInvenroryCheck = await inventoryCheckService.findById(result.id);

    res.json({
      message: 'ตรวจสอบครุภัณฑ์ สำเร็จ',
      item: resInvenroryCheck,
    });
  } catch (error) {
    next(error);
  }
}

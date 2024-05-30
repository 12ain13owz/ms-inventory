import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { inventoryCheckService } from '../services/inventory-check.service';
import { InventoryCheckType } from '../schemas/inventory-check.schema';
import { InventoryCheck } from '../models/inventory-check.model';
import { inventoryService } from '../services/inventory.service';
import { newError } from '../utils/helper';
import { Inventory } from '../models/inventory.model';
import { Log } from '../models/log.model';
import sequelize from '../utils/sequelize';
import { logService } from '../services/log.service';

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
  res.locals.func = 'createInventoryCheckController';
  const t = await sequelize.transaction();

  try {
    const { inventoryId, statusId, statusName } = req.body;
    const currentYear = new Date().getFullYear();
    const inventoryCheck = await inventoryCheckService.findByInventoryId(
      inventoryId,
      currentYear
    );
    const inventory = await inventoryService.findByIdDetails(inventoryId);
    if (!inventory) throw newError(404, 'ไม่พบครุภัณฑ์');

    let resLog;
    if (inventory.statusId !== statusId) {
      const payloadInventory: Partial<Inventory> = {
        statusId: statusId,
      };

      const payloadLog = new Log({
        track: inventory.track,
        code: inventory.code,
        oldCode: inventory.oldCode,
        description: inventory.description,
        unit: inventory.unit,
        value: inventory.value,
        receivedDate: inventory.receivedDate,
        remark: inventory.remark,
        image: inventory.image,
        isCreated: false,
        firstname: res.locals.user!.firstname,
        lastname: res.locals.user!.lastname,
        categoryName: inventory.Category.name,
        statusName: statusName,
        fundName: inventory.Fund.name,
        locationName: inventory.Location.name,
      });

      const [result] = await inventoryService.update(
        inventoryId,
        payloadInventory,
        t
      );

      if (!result)
        throw newError(400, `แก้ไขครุภัณฑ์ ${inventory.code} ไม่สำเร็จ`);

      const resultLog = await logService.create(payloadLog, t);
      resLog = resultLog.toJSON();
    }

    if (inventoryCheck) {
      await t.commit();
      return res.json({
        message: 'ตรวจสอบครุภัณฑ์ สำเร็จ',
        item: {
          inventoryCheck: inventoryCheck.toJSON(),
          log: resLog,
        },
      });
    }

    const payload = new InventoryCheck({ inventoryId, year: currentYear });
    const result = await inventoryCheckService.create(payload, t);
    await t.commit();

    const resInvenroryCheck = await inventoryCheckService.findById(result.id);
    res.json({
      message: 'ตรวจสอบครุภัณฑ์ สำเร็จ',
      item: {
        inventoryCheck: resInvenroryCheck,
        log: resLog,
      },
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
}

export async function deleteInventoryCheckController(
  req: Request<InventoryCheckType['delete']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'deleteInventoryCheckController';

  try {
    const id = +req.params.id;
    const inventoryCheck = await inventoryCheckService.findById(id);
    if (!inventoryCheck)
      throw newError(400, 'ไม่พบตรวจสอบครุภัณฑ์ ที่ต้องการลบ');

    const code = inventoryCheck.Inventory.code;
    const result = await inventoryCheckService.delete(id);
    if (!result) throw newError(400, `ลบตรวจสอบครุภัณฑ์รหัส ${code} ไม่สำเร็จ`);

    res.json({ message: `ลบตรวจสอบครุภัณฑ์รหัส ${code} สำเร็จ` });
  } catch (error) {
    next(error);
  }
}

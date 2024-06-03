import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { inventoryService } from '../services/inventory.service';
import { InventoryType } from '../schemas/inventory.schema';
import { newError, removeWhitespace } from '../utils/helper';
import sequelize from '../utils/sequelize';
import { generateTrack } from '../utils/track';
import { trackService } from '../services/track.service';
import { logService } from '../services/log.service';
import { Inventory } from '../models/inventory.model';
import { Log, PropertyLog } from '../models/log.model';

let cache: string[] = [];

export async function searchInventoryController(
  req: Request<{}, {}, {}, InventoryType['search']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'searchInventoryController';

  try {
    const query = req.query.code.toLocaleLowerCase();
    const inventories = cache.filter((item) => item.includes(query));
    if (inventories.length > 0) return res.json(inventories);

    const result = await inventoryService.search(query);
    const records = result.map((item) => item.code);
    const combine = new Set([...cache, ...records]);
    cache = Array.from(combine);

    res.json(cache);
  } catch (error) {
    res.status(200).json([]);
  }
}

export async function findAllInventoryController(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findAllInventoryController';

  try {
    const resInventories = await inventoryService.findAll();
    res.json(resInventories);
  } catch (error) {
    next(error);
  }
}

export async function initialInventoryController(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'initialInventoryController';

  try {
    const inventories = await inventoryService.findLimit(30);
    const resInventories = inventories.sort((a, b) => a.id - b.id);

    res.json(resInventories);
  } catch (error) {
    next(error);
  }
}

export async function findInventoryByDateController(
  req: Request<InventoryType['findByDate']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findInventoryByDateController';

  try {
    const dateStart = new Date(req.params.dateStart);
    const dateEnd = new Date(req.params.dateEnd);

    if (isNaN(dateStart.getTime()) || isNaN(dateEnd.getTime()))
      throw newError(400, 'รูปแบบวันที่ไม่ถูกต้อง');

    dateStart.setHours(0, 0, 0, 0);
    dateEnd.setHours(23, 59, 59, 999);

    const resInventories = await inventoryService.findByDate(
      dateStart,
      dateEnd
    );
    res.json(resInventories);
  } catch (error) {
    next(error);
  }
}

export async function findInventoryByTrackController(
  req: Request<InventoryType['findByTrack']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findInventoryByTrackController';

  try {
    const track = req.params.track;
    const resInventory = await inventoryService.findByTrack(track);

    res.json(resInventory?.toJSON());
  } catch (error) {
    next(error);
  }
}

export async function findInventoryByIdController(
  req: Request<InventoryType['findById']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findInventoryByIdController';

  try {
    const id = +req.params.id;
    const resInventory = await inventoryService.findById(id);

    res.json(resInventory?.toJSON());
  } catch (error) {
    next(error);
  }
}

export async function findInventoryByCodeController(
  req: Request<InventoryType['findByCode']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findInventoryByCodeController';

  try {
    const code = removeWhitespace(req.params.code);
    const resInventory = await inventoryService.findByCode(code);

    res.json(resInventory?.toJSON());
  } catch (error) {
    next(error);
  }
}

export async function createInventoryController(
  req: Request<{}, {}, InventoryType['create']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'createInventoryController';
  const t = await sequelize.transaction();

  try {
    const code = removeWhitespace(req.body.code);
    const existingInventory = await inventoryService.findByCode(code);
    if (existingInventory) throw newError(400, `รหัสครุภัณฑ์ ${code} ซ้ำ'`);

    const sequence = await trackService.create(t);
    const track = await generateTrack(sequence.id);
    const value = parseFloat(req.body.value.replace(/,/g, ''));
    const receivedDate = new Date(req.body.receivedDate);
    const image = req.body.image === 'null' ? null : req.body.image;

    const payloadInventory: Inventory = new Inventory({
      track: track,
      code: code,
      oldCode: req.body.oldCode || '',
      description: req.body.description,
      unit: req.body.unit,
      value: value,
      receivedDate: receivedDate,
      remark: req.body.remark || '',
      image: image || '',
      userId: res.locals.userId!,
      categoryId: +req.body.categoryId,
      statusId: +req.body.statusId,
      fundId: +req.body.fundId,
      locationId: +req.body.locationId,
    });

    const propertyLog: PropertyLog = {
      track: track,
      value: value,
      receivedDate: receivedDate,
      image: image || '',
      isCreated: true,
      firstname: res.locals.user!.firstname,
      lastname: res.locals.user!.lastname,
      categoryName: req.body.categoryName,
      statusName: req.body.statusName,
      fundName: req.body.fundName,
      locationName: req.body.locationName,
    };
    const payloadLog = generateLog(req.body, propertyLog);

    const resultInventory = await inventoryService.create(payloadInventory, t);
    const resultLog = await logService.create(payloadLog, t);
    await t.commit();

    const resInventory = await inventoryService.findById(resultInventory.id);
    const resLog = resultLog.toJSON();

    res.json({
      message: `เพิ่มครุภัณฑ์ ${code} สำเร็จ`,
      item: {
        inventory: resInventory,
        log: resLog,
      },
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
}

export async function updateInventoryController(
  req: Request<
    InventoryType['update']['params'],
    {},
    InventoryType['update']['body']
  >,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateInventoryController';
  const t = await sequelize.transaction();

  try {
    const id = +req.params.id;
    const inventory = await inventoryService.findById(id);
    if (!inventory) throw newError(404, 'ไม่พบครุภัณฑ์');

    const code = removeWhitespace(req.body.code);
    const existingInventory = await inventoryService.findByCode(code);
    if (existingInventory && existingInventory.id !== id)
      throw newError(400, `รหัสครุภัณฑ์ ${code} ซ้ำ'`);

    const track = inventory.track;
    const value = parseFloat(req.body.value.replace(/,/g, ''));
    const imageEdit = req.body.imageEdit === 'true' ? true : false;
    const file = req.body.image === 'null' ? null : req.body.image;
    const image = imageEdit ? file : inventory.image;
    const receivedDate = new Date(req.body.receivedDate);

    const payloadInventory: Partial<Inventory> = {
      code: code,
      oldCode: req.body.oldCode || '',
      description: req.body.description,
      unit: req.body.unit,
      value: value,
      receivedDate: receivedDate,
      remark: req.body.remark || '',
      image: image || '',
      userId: res.locals.userId!,
      categoryId: +req.body.categoryId,
      statusId: +req.body.statusId,
      fundId: +req.body.fundId,
      locationId: +req.body.locationId,
    };

    const propertyLog: PropertyLog = {
      track: track,
      value: value,
      receivedDate: receivedDate,
      image: image || '',
      isCreated: false,
      firstname: res.locals.user!.firstname,
      lastname: res.locals.user!.lastname,
      categoryName: req.body.categoryName,
      statusName: req.body.statusName,
      fundName: req.body.fundName,
      locationName: req.body.locationName,
    };
    const payloadLog = generateLog(req.body, propertyLog);

    const [result] = await inventoryService.update(id, payloadInventory, t);
    if (!result) throw newError(400, `แก้ไขครุภัณฑ์ ${code} ไม่สำเร็จ`);

    const resultLog = await logService.create(payloadLog, t);
    await t.commit();

    const resInventory = await inventoryService.findById(id);
    const resLog = resultLog.toJSON();

    res.json({
      message: `แก้ไขครุภัณฑ์ ${code} สำเร็จ`,
      item: {
        inventory: resInventory,
        log: resLog,
      },
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
}

export async function deleteInventoryController(
  req: Request<InventoryType['delete']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'deleteInventoryController';

  try {
    const id = +req.params.id;
    const inventory = await inventoryService.findById(id);
    if (!inventory) throw newError(400, 'ไม่พบ ครุภัณฑ์');

    const code = inventory.code;
    const result = await inventoryService.delete(id);
    if (!result) throw newError(400, `ลบครุภัณฑ์ ${code} ไม่สำเร็จ`);

    res.json({ message: `ลบครุภัณฑ์ ${code} สำเร็จ` });
  } catch (error) {
    next(error);
  }
}

function generateLog(body: InventoryType['create'], property: PropertyLog) {
  return new Log({
    track: property.track,
    code: body.code,
    oldCode: body.oldCode || '',
    description: body.description,
    unit: body.unit,
    value: property.value,
    receivedDate: property.receivedDate,
    remark: body.remark || '',
    image: property.image || '',
    isCreated: property.isCreated,
    firstname: property.firstname,
    lastname: property.lastname,
    categoryName: property.categoryName,
    statusName: property.statusName,
    fundName: property.fundName,
    locationName: property.locationName,
  });
}

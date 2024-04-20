import {
  UpdatePrintParcelInput,
  UpdateQuantityParcelInput,
  getParcelByIdInput,
  getParcelByTrackInput,
  getParcelByDateInput,
} from './../schemas/parcel.schema';
import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import {
  createParcel,
  deleteParcel,
  findAllParcel,
  findLimitParcel,
  findParcelByCode,
  findParcelById,
  findParcelByTrack,
  findParcelByDate,
  updateParcel,
  updatePrintParcel,
  updateQuantityParcel,
} from '../services/parcel.service';
import {
  CreateParcelInput,
  DeleteParcelInput,
  UpdateParcelInput,
} from '../schemas/parcel.schema';
import sequelize from '../utils/sequelize';
import { createTrack } from '../services/track.service';
import { newError, removeWhitespace } from '../utils/helper';
import { generateTrack } from '../utils/track';
import { Parcel } from '../models/parcel.model';
import { Log } from '../models/log.model';
import { createLog } from '../services/log.service';

export async function getAllParcelHandler(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getAllPercelHandler';

  try {
    const resParcels = await findAllParcel();
    res.json(resParcels);
  } catch (error) {
    next(error);
  }
}

export async function getInitialParcelsHandler(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getInitialParcelsHandler';

  try {
    const parcels = await findLimitParcel(30);
    const resParcels = parcels.sort((a, b) => a.id - b.id);

    res.json(resParcels);
  } catch (error) {
    next(error);
  }
}

export async function getParcelByDateHandler(
  req: Request<getParcelByDateInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getParcelByDateHandler';

  try {
    const dateStart = new Date(req.params.dateStart);
    const dateEnd = new Date(req.params.dateEnd);

    if (isNaN(dateStart.getTime()) || isNaN(dateEnd.getTime()))
      throw newError(400, 'รูปแบบวันที่ไม่ถูกต้อง');

    dateStart.setHours(0, 0, 0, 0);
    dateEnd.setHours(23, 59, 59, 999);

    const resParcels = await findParcelByDate(dateStart, dateEnd);
    res.json(resParcels);
  } catch (error) {
    next(error);
  }
}

export async function getParcelByTrackHandler(
  req: Request<getParcelByTrackInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getParcelByTrackHandler';

  try {
    const track = req.params.track;
    const resParcel = await findParcelByTrack(track);

    res.json(resParcel?.toJSON());
  } catch (error) {
    next(error);
  }
}

export async function getParcelByIdHandler(
  req: Request<getParcelByIdInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getParcelByTrackHandler';

  try {
    const id = +req.params.id;
    const resParcel = await findParcelById(id);

    res.json(resParcel?.toJSON());
  } catch (error) {
    next(error);
  }
}

export async function createParcelHandler(
  req: Request<{}, {}, CreateParcelInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'createPercelHandler';
  const t = await sequelize.transaction();

  try {
    const code = removeWhitespace(req.body.code);
    const existingParcel = await findParcelByCode(code);
    if (existingParcel) throw newError(400, `รหัสพัสดุ ${code} ซ้ำ`);

    const sequence = await createTrack(t);
    const track = await generateTrack(sequence.id);
    const receivedDate = new Date(req.body.receivedDate);
    const image = req.body.image === 'null' ? null : req.body.image;

    const payloadParcel: Parcel = new Parcel({
      track: track,
      code: code,
      oldCode: req.body.oldCode || '',
      receivedDate: receivedDate,
      detail: req.body.detail || '',
      quantity: +req.body.quantity || 0,
      print: false,
      remark: req.body.remark || '',
      image: image || '',
      UserId: res.locals.userId!,
      CategoryId: +req.body.categoryId,
      StatusId: +req.body.statusId,
    });
    const payloadLog: Log = new Log({
      track: track,
      code: code,
      oldCode: req.body.oldCode || '',
      receivedDate: receivedDate,
      detail: req.body.detail || '',
      quantity: +req.body.quantity || 0,
      modifyQuantity: 0,
      firstname: res.locals.user!.firstname,
      lastname: res.locals.user!.lastname,
      categoryName: req.body.categoryName || '',
      statusName: req.body.statusName || '',
      remark: req.body.remark || '',
      image: image || '',
      newParcel: true,
      increaseQuantity: false,
      decreaseQuantity: false,
      print: false,
      printCount: 0,
      detailLog: 'สร้างพัสดุ',
    });

    const resultParcel = await createParcel(payloadParcel, t);
    const resultLog = await createLog(payloadLog, t);
    await t.commit();

    const resParcel = await findParcelById(resultParcel.id);
    const resLog = resultLog.toJSON();

    res.json({
      message: `เพิ่ม ${track} พัสดุสำเร็จ`,
      parcel: resParcel,
      log: resLog,
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
}

export async function updateParcelHandler(
  req: Request<UpdateParcelInput['params'], {}, UpdateParcelInput['body']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateParcelHandler';
  const t = await sequelize.transaction();

  try {
    const id = +req.params.id;
    const parcel = await findParcelById(id);
    if (!parcel) throw newError(404, 'ไม่พบพัสดุ');

    const track = parcel.track;
    const code = removeWhitespace(req.body.code);
    const existingParcel = await findParcelByCode(code);
    if (existingParcel && existingParcel.id !== id)
      throw newError(400, `รหัสพัสดุ ${code} ซ้ำ`);

    const imageEdit = req.body.imageEdit === 'true' ? true : false;
    const file = req.body.image === 'null' ? null : req.body.image;
    const image = imageEdit ? file : parcel.image;
    const receivedDate = new Date(req.body.receivedDate);

    const payloadParcel: Partial<Parcel> = {
      code: code,
      oldCode: req.body.oldCode || '',
      receivedDate: receivedDate,
      detail: req.body.detail || '',
      remark: req.body.remark || '',
      image: image || '',
      UserId: res.locals.userId!,
      CategoryId: +req.body.categoryId,
      StatusId: +req.body.statusId,
    };

    const payloadLog: Log = new Log({
      track: track,
      code: code,
      oldCode: req.body.oldCode || '',
      receivedDate: receivedDate,
      detail: req.body.detail || '',
      quantity: parcel.quantity,
      modifyQuantity: 0,
      firstname: res.locals.user!.firstname,
      lastname: res.locals.user!.lastname,
      categoryName: req.body.categoryName || '',
      statusName: req.body.statusName || '',
      remark: req.body.remark || '',
      image: image || '',
      newParcel: false,
      increaseQuantity: false,
      decreaseQuantity: false,
      print: false,
      printCount: 0,
      detailLog: 'แก้ไขพัสดุ',
    });

    const resultParcel = await updateParcel(id, payloadParcel, t);
    if (!resultParcel[0]) throw newError(400, `แก้ไขพัสดุ ${track} ไม่สำเร็จ`);

    const resultLog = await createLog(payloadLog, t);
    await t.commit();

    const resParcel = await findParcelById(id);
    const resLog = resultLog.toJSON();

    res.json({
      message: `แก้ไขพัสดุ ${track} สำเร็จ`,
      parcel: resParcel,
      log: resLog,
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
}

export async function incrementQuantityParcelHandler(
  req: Request<
    UpdateQuantityParcelInput['params'],
    {},
    UpdateQuantityParcelInput['body']
  >,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'incrementQuantityParcelHandler';
  const t = await sequelize.transaction();

  try {
    const id = +req.params.id;
    const parcel = await findParcelById(id);
    if (!parcel) throw newError(404, 'ไม่พบพัสดุ');

    const quantity = parcel.quantity + req.body.stock;
    const payloadLog: Log = new Log({
      track: parcel.track,
      code: parcel.code,
      oldCode: parcel.oldCode,
      receivedDate: parcel.receivedDate,
      detail: parcel.detail,
      quantity: quantity,
      modifyQuantity: req.body.stock,
      firstname: res.locals.user!.firstname,
      lastname: res.locals.user!.lastname,
      categoryName: parcel.Category.name,
      statusName: parcel.Status.name,
      remark: parcel.remark,
      image: parcel.image,
      newParcel: false,
      increaseQuantity: true,
      decreaseQuantity: false,
      print: false,
      printCount: 0,
      detailLog: 'เพิ่มสต็อก',
    });

    const resultParcel = await updateQuantityParcel(id, quantity, t);
    if (!resultParcel[0])
      throw newError(400, `เพิ่มสต็อก ${parcel.track} ไม่สำเร็จ`);

    const resultLog = await createLog(payloadLog, t);
    await t.commit();

    const resLog = resultLog.toJSON();
    res.json({
      message: `เพิ่มสต็อก ${parcel.track} สำเร็จ`,
      id: id,
      quantity: quantity,
      log: resLog,
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
}

export async function decrementQuantityParcelHandler(
  req: Request<
    UpdateQuantityParcelInput['params'],
    {},
    UpdateQuantityParcelInput['body']
  >,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'decrementQuantityParcelHandler';
  const t = await sequelize.transaction();

  try {
    const id = +req.params.id;
    const parcel = await findParcelById(id);
    if (!parcel) throw newError(404, 'ไม่พบพัสดุ');

    if (parcel.quantity === 0)
      throw newError(
        400,
        `ไม่สามารถตัดสต็อก ${parcel.track} ได้เนื่องจากจำนวนของพัสดุเหลือ 0`
      );

    const quantity = Math.max(parcel.quantity - req.body.stock, 0);
    const payloadLog: Log = new Log({
      track: parcel.track,
      code: parcel.code,
      oldCode: parcel.oldCode,
      receivedDate: parcel.receivedDate,
      detail: parcel.detail,
      quantity: quantity,
      modifyQuantity: req.body.stock,
      firstname: res.locals.user!.firstname,
      lastname: res.locals.user!.lastname,
      categoryName: parcel.Category.name,
      statusName: parcel.Status.name,
      remark: parcel.remark,
      image: parcel.image,
      newParcel: false,
      increaseQuantity: false,
      decreaseQuantity: true,
      print: false,
      printCount: 0,
      detailLog: 'ตัดสต็อก',
    });

    const resultParcel = await updateQuantityParcel(id, quantity, t);
    if (!resultParcel[0])
      throw newError(400, `ตัดสต็อก ${parcel.track} ไม่สำเร็จ`);

    const resultLog = await createLog(payloadLog, t);
    await t.commit();

    const resLog = resultLog.toJSON();

    res.json({
      message: `ตัดสต็อก ${parcel.track} สำเร็จ`,
      id: id,
      quantity: quantity,
      log: resLog,
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
}

export async function updatePrintParcelHandler(
  req: Request<
    UpdatePrintParcelInput['params'],
    {},
    UpdatePrintParcelInput['body']
  >,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updatePrintParcelHandler';
  const t = await sequelize.transaction();

  try {
    const id = +req.params.id;
    const parcel = await findParcelById(id);
    if (!parcel) throw newError(404, 'ไม่พบพัสดุ');

    const payloadLog: Log = new Log({
      track: parcel.track,
      code: parcel.code,
      oldCode: parcel.oldCode,
      receivedDate: parcel.receivedDate,
      detail: parcel.detail,
      quantity: parcel.quantity,
      modifyQuantity: 0,
      firstname: res.locals.user!.firstname,
      lastname: res.locals.user!.lastname,
      categoryName: parcel.Category.name,
      statusName: parcel.Status.name,
      remark: parcel.remark,
      image: parcel.image,
      newParcel: false,
      increaseQuantity: false,
      decreaseQuantity: true,
      print: true,
      printCount: req.body.printCount,
      detailLog: req.body.detailLog || '',
    });

    if (!parcel.print) {
      const resultParcel = await updatePrintParcel(id, t);
      if (!resultParcel[0])
        throw newError(400, `แก้ไขข้อมูลปริ้น ${parcel.track} ไม่สำเร็จ`);
    }
    const resultLog = await createLog(payloadLog, t);
    await t.commit();

    const resLog = resultLog.toJSON();
    res.json({
      message: `ปริ้น ${parcel.track} สำเร็จ`,
      id: id,
      log: resLog,
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
}

export async function deleteParcelHandler(
  req: Request<DeleteParcelInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'deleteParcelHandler';

  try {
    const id = +req.params.id;
    const parcel = await findParcelById(id);
    if (!parcel) throw newError(400, 'ไม่พบพัสดุ');

    const track = parcel.track;
    const result = await deleteParcel(id);
    if (!result) throw newError(400, `ลบ ${track} ไม่สำเร็จ`);

    res.json({ message: `ลบ ${track} สำเร็จ` });
  } catch (error) {
    next(error);
  }
}

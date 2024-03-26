import {
  UpdateQuantityParcelInput,
  getParcelByTrackInput,
  getParcelsByDateInput,
} from './../schemas/parcel.schema';
import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import {
  createParcel,
  deleteParcel,
  findAllParcel,
  findParcelByCode,
  findParcelById,
  findParcelByTrack,
  findParcelsByDate,
  updateParcel,
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
import { Parcel, ParcelData } from '../models/parcel.model';
import { omit } from 'lodash';
import { Log } from '../models/log.model';
import { createLog } from '../services/log.service';

export async function getAllParcelHandler(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getAllPercelHandler';

  try {
    const payload = await findAllParcel();
    res.json(payload);
  } catch (error) {
    next(error);
  }
}

export async function getParcelsByDateHandler(
  req: Request<getParcelsByDateInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getParcelsByDateHandler';

  try {
    const dateStart = new Date(req.params.dateStart);
    const dateEnd = new Date(req.params.dateEnd);

    if (isNaN(dateStart.getTime()) || isNaN(dateEnd.getTime()))
      throw newError(400, 'รูปแบบวันที่ไม่ถูกต้อง');

    dateStart.setHours(0, 0, 0, 0);
    dateEnd.setHours(23, 59, 59, 999);

    const payload = await findParcelsByDate(dateStart, dateEnd);
    res.json(payload);
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
    const payload = await findParcelByTrack(track);
    res.json(payload?.toJSON());
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
    if (existingParcel) throw newError(400, 'รหัสพัสดุซ้ำ');

    const sequence = await createTrack(t);
    const track = await generateTrack(sequence.dataValues.id!);
    const receivedDate = new Date(req.body.receivedDate);

    const payloadParcel: Parcel = new Parcel({
      track: track,
      code: code,
      oldCode: req.body.oldCode || '',
      receivedDate: receivedDate,
      detail: req.body.detail || '',
      quantity: +req.body.quantity || 0,
      print: false,
      remark: req.body.remark || '',
      image: req.body.image || '',
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
      image: req.body.image || '',
      printCount: 0,
      addParcel: true,
      addQuantity: true,
    });

    const resultParcel = await createParcel(payloadParcel, t);
    const resultLog = await createLog(payloadLog, t);
    await t.commit();

    const excludeParcel = omit(resultParcel.dataValues, [
      'UserId',
      'CategoryId',
      'StatusId',
    ]);

    const newParcel = {
      ...excludeParcel,
      User: {
        firstname: res.locals.user!.firstname,
        lastname: res.locals.user!.lastname,
      },
      Category: { name: req.body.categoryName },
      Status: { name: req.body.statusName },
    };
    const newLog = resultLog.dataValues;

    res.json({
      message: 'เพิ่มพัสดุสำเร็จ',
      parcel: newParcel,
      log: newLog,
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

    const code = removeWhitespace(req.body.code);
    const existingParcel = await findParcelByCode(code);
    if (existingParcel && existingParcel.id !== id)
      throw newError(400, 'รหัสพัสดุซ้ำ');

    const receivedDate = new Date(req.body.receivedDate);
    const payloadParcel: Partial<Parcel> = {
      code: code,
      oldCode: req.body.oldCode || '',
      receivedDate: receivedDate,
      detail: req.body.detail || '',
      remark: req.body.remark || '',
      image: req.body.image || '',
      UserId: res.locals.userId!,
      CategoryId: +req.body.categoryId,
      StatusId: +req.body.statusId,
    };

    const payloadLog: Log = new Log({
      track: parcel.dataValues.track,
      code: code,
      oldCode: req.body.oldCode || '',
      receivedDate: receivedDate,
      detail: req.body.detail || '',
      quantity: parcel.dataValues.quantity,
      modifyQuantity: 0,
      firstname: res.locals.user!.firstname,
      lastname: res.locals.user!.lastname,
      categoryName: req.body.categoryName || '',
      statusName: req.body.statusName || '',
      remark: req.body.remark || '',
      image: req.body.image || '',
      printCount: 0,
      addParcel: false,
      addQuantity: false,
    });

    const resultParcel = await updateParcel(id, payloadParcel, t);
    if (!resultParcel[0]) throw newError(400, 'อัพเดทพัสดุไม่สำเร็จ');

    const resultLog = await createLog(payloadLog, t);
    await t.commit();
    const newLog = resultLog.dataValues;

    res.json({
      message: 'อัพเดทพัสดุสำเร็จ',
      parcel: payloadParcel,
      log: newLog,
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

    const quantity = parcel.quantity + req.body.quantity;
    const parcelData: ParcelData = parcel.toJSON();
    const payloadLog: Log = new Log({
      track: parcelData.track,
      code: parcelData.code,
      oldCode: parcelData.oldCode,
      receivedDate: parcelData.receivedDate,
      detail: parcelData.detail,
      quantity: quantity,
      modifyQuantity: req.body.quantity,
      firstname: res.locals.user!.firstname,
      lastname: res.locals.user!.lastname,
      categoryName: parcelData.Category!.name,
      statusName: parcelData.Status!.name,
      remark: parcelData.remark,
      image: parcelData.image,
      printCount: 0,
      addParcel: false,
      addQuantity: true,
    });

    const resultParcel = await updateQuantityParcel(id, quantity, t);
    if (!resultParcel[0]) throw newError(400, 'เพิ่มสต็อกไม่สำเร็จ');

    const resultLog = await createLog(payloadLog, t);
    await t.commit();
    const newLog = resultLog.dataValues;

    res.json({ message: 'เพิ่มสต็อกสำเร็จ', quantity, log: newLog });
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
      throw newError(400, 'ไม่สามารถตัดสต็อกได้ เนื่องจากจำนวนของพัสดุเหลือ 0');

    const quantity = Math.max(parcel.quantity - req.body.quantity, 0);

    const parcelData: ParcelData = parcel.toJSON();
    const payloadLog: Log = new Log({
      track: parcelData.track,
      code: parcelData.code,
      oldCode: parcelData.oldCode,
      receivedDate: parcelData.receivedDate,
      detail: parcelData.detail,
      quantity: quantity,
      modifyQuantity: req.body.quantity,
      firstname: res.locals.user!.firstname,
      lastname: res.locals.user!.lastname,
      categoryName: parcelData.Category!.name,
      statusName: parcelData.Status!.name,
      remark: parcelData.remark,
      image: parcelData.image,
      printCount: 0,
      addParcel: false,
      addQuantity: false,
    });

    const resultParcel = await updateQuantityParcel(id, quantity, t);
    if (!resultParcel[0]) throw newError(400, 'ตัดสต็อกไม่สำเร็จ');

    const resultLog = await createLog(payloadLog, t);
    await t.commit();
    const newLog = resultLog.dataValues;

    res.json({ message: 'ตัดสต็อกสำเร็จ', quantity, log: newLog });
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
    const result = await deleteParcel(+req.params.id);
    if (!result) throw newError(400, 'ลบประเภทอุปกรณ์ไม่สำเร็จ');

    res.json({ message: 'ลบประเภทอุปกรณ์สำเร็จ' });
  } catch (error) {
    next(error);
  }
}

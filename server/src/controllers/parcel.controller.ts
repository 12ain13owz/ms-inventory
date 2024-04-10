import {
  UpdateQuantityParcelInput,
  getParcelByIdInput,
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
    const resParcels = await findAllParcel();
    res.json(resParcels);
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

    const resParcels = await findParcelsByDate(dateStart, dateEnd);
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
      printCount: 0,
      addParcel: true,
      addQuantity: true,
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
      printCount: 0,
      addParcel: false,
      addQuantity: false,
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

    const quantity = parcel.quantity + req.body.quantity;
    const parcelData: ParcelData = {
      id: parcel.id,
      track: parcel.track,
      code: parcel.code,
      oldCode: parcel.oldCode,
      receivedDate: parcel.receivedDate,
      detail: parcel.detail,
      quantity: parcel.quantity,
      print: parcel.print,
      remark: parcel.remark,
      image: parcel.image,
      createdAt: parcel.createdAt,
      updatedAt: parcel.updatedAt,
      User: parcel.User.toJSON(),
      Category: parcel.Category.toJSON(),
      Status: parcel.Status.toJSON(),
    };

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
      categoryName: parcelData.Category.name,
      statusName: parcelData.Status.name,
      remark: parcelData.remark,
      image: parcelData.image,
      printCount: 0,
      addParcel: false,
      addQuantity: true,
    });

    const resultParcel = await updateQuantityParcel(id, quantity, t);
    if (!resultParcel[0])
      throw newError(400, `เพิ่มสต็อก ${parcelData.track} ไม่สำเร็จ`);

    const resultLog = await createLog(payloadLog, t);
    await t.commit();

    const resLog = resultLog.toJSON();
    res.json({
      message: `เพิ่มสต็อก ${parcelData.track} สำเร็จ`,
      quantity,
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

    const parcelData: ParcelData = {
      id: parcel.id,
      track: parcel.track,
      code: parcel.code,
      oldCode: parcel.oldCode,
      receivedDate: parcel.receivedDate,
      detail: parcel.detail,
      quantity: parcel.quantity,
      print: parcel.print,
      remark: parcel.remark,
      image: parcel.image,
      createdAt: parcel.createdAt,
      updatedAt: parcel.updatedAt,
      User: parcel.User.toJSON(),
      Category: parcel.Category.toJSON(),
      Status: parcel.Status.toJSON(),
    };

    if (parcelData.quantity === 0)
      throw newError(
        400,
        `ไม่สามารถตัดสต็อก ${parcelData.track} ได้ เนื่องจากจำนวนของพัสดุเหลือ 0`
      );

    const quantity = Math.max(parcelData.quantity - req.body.quantity, 0);
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
      categoryName: parcelData.Category.name,
      statusName: parcelData.Status.name,
      remark: parcelData.remark,
      image: parcelData.image,
      printCount: 0,
      addParcel: false,
      addQuantity: false,
    });

    const resultParcel = await updateQuantityParcel(id, quantity, t);
    if (!resultParcel[0])
      throw newError(400, `ตัดสต็อก ${parcelData.track} ไม่สำเร็จ`);

    const resultLog = await createLog(payloadLog, t);
    await t.commit();

    const resLog = resultLog.toJSON();
    res.json({
      message: `ตัดสต็อก ${parcelData.track} สำเร็จ`,
      quantity,
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

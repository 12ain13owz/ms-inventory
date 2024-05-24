import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { omit } from 'lodash';
import { newError, privateFields, removeWhitespace } from '../utils/helper';
import { AssetStatus } from '../models/asset-status.model';
import { AssetStatusType } from '../schemas/asset-status.schema';
import { assetStatusService } from '../services/asset-status.service';

export async function findAllAssetsController(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findAllAssetsController';

  try {
    const assetStatuses = await assetStatusService.findAll();
    res.json(assetStatuses);
  } catch (error) {
    next(error);
  }
}

export async function createAssetStatusController(
  req: Request<{}, {}, AssetStatusType['create']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'createAssetStatusController';

  try {
    const name = removeWhitespace(req.body.name);
    const assetStatus = await assetStatusService.findByName(name);
    if (assetStatus) throw newError(400, `สถานะครุภัณฑ์ ${name} ซ้ำ`);

    const payload = new AssetStatus({
      name: name,
      active: req.body.active,
      remark: req.body.remark || '',
    });
    const result = await assetStatusService.create(payload);
    const newAssetStatus = omit(result.toJSON(), privateFields);

    res.json({
      message: `เพิ่มสถานะครุภัณฑ์ ${name} สำเร็จ`,
      assetStatus: newAssetStatus,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAssetStatusController(
  req: Request<
    AssetStatusType['update']['params'],
    {},
    AssetStatusType['update']['body']
  >,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateAssetStatusController';

  try {
    const id = +req.params.id;
    const name = removeWhitespace(req.body.name);
    const existingAssetStatus = await assetStatusService.findByName(name);

    if (existingAssetStatus && existingAssetStatus.id !== id)
      throw newError(400, `ชื่อสถานะครุภัณฑ์ ${name} ซ้ำ`);

    const payload: Partial<AssetStatus> = {
      name: name,
      active: req.body.active,
      remark: req.body.remark || '',
    };
    const [result] = await assetStatusService.update(id, payload);
    if (!result) throw newError(400, `แก้ไขสถานะครุภัณฑ์ ${name} ไม่สำเร็จ`);

    res.json({
      message: `แก้ไขสถานะครุภัณฑ์ ${name} สำเร็จ`,
      assetStatus: payload,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAssetStatusController(
  req: Request<AssetStatusType['delete']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'deleteAssetStatusController';

  try {
    const id = +req.params.id;
    const assetStatus = await assetStatusService.findById(id);
    if (!assetStatus) throw newError(400, 'ไม่พบสถานะครุภัณฑ์');

    const name = assetStatus.name;
    const result = await assetStatusService.delete(id);
    if (!result) throw newError(400, `ลบสถานะครุภัณฑ์ ${name} ไม่สำเร็จ`);

    res.json({ message: `ลบสถานะครุภัณฑ์ ${name} สำเร็จ` });
  } catch (error) {
    next(error);
  }
}

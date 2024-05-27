import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { omit } from 'lodash';
import { newError, privateFields, removeWhitespace } from '../utils/helper';
import { Location } from '../models/location.model';
import { LocationType } from '../schemas/location.schema';
import { locationService } from '../services/location.service';

export async function findAllLocationController(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findAllLocationController';

  try {
    const locations = await locationService.findAll();
    res.json(locations);
  } catch (error) {
    next(error);
  }
}

export async function createLocationController(
  req: Request<{}, {}, LocationType['create']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'createLocationController';

  try {
    const name = removeWhitespace(req.body.name);
    const location = await locationService.findByName(name);
    if (location) throw newError(400, `ห้อง ${name} ซ้ำ`);

    const payload = new Location({
      name: name,
      active: req.body.active,
      remark: req.body.remark || '',
    });
    const result = await locationService.create(payload);
    const newLocation = omit(result.toJSON(), privateFields);

    res.json({
      message: `เพิ่มห้อง ${name} สำเร็จ`,
      fund: newLocation,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateLocationController(
  req: Request<
    LocationType['update']['params'],
    {},
    LocationType['update']['body']
  >,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateLocationController';

  try {
    const id = +req.params.id;
    const location = await locationService.findById(id);
    if (!location) throw newError(400, 'ไม่พบห้อง');

    const name = removeWhitespace(req.body.name);
    const existingLocation = await locationService.findByName(name);
    if (existingLocation && existingLocation.id !== id)
      throw newError(400, `ห้อง ${name} ซ้ำ`);

    const payload: Partial<Location> = {
      name: name,
      active: req.body.active,
      remark: req.body.remark || '',
    };
    const [result] = await locationService.update(id, payload);
    if (!result) throw newError(400, `แก้ไขห้อง ${name} ไม่สำเร็จ`);

    res.json({
      message: `แก้ไขห้อง ${name} สำเร็จ`,
      location: payload,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteLocationController(
  req: Request<LocationType['delete']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'deleteLocationController';

  try {
    const id = +req.params.id;
    const location = await locationService.findById(id);
    if (!location) throw newError(400, 'ไม่พบห้อง');

    const name = location.name;
    const result = await locationService.delete(id);
    if (!result) throw newError(400, `ลบห้อง ${name} ไม่สำเร็จ`);

    res.json({ message: `ลบห้อง ${name} สำเร็จ` });
  } catch (error) {
    next(error);
  }
}

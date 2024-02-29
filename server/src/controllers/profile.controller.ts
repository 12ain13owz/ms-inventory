import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import {
  findUserById,
  updateUser,
  updateUserPassword,
} from '../services/user.service';
import {
  getProfileInput,
  updateProfileInput,
  updatePasswordInput,
} from '../schemas/profile.schema';
import { newError } from '../utils/error';
import { omit } from 'lodash';
import { User, privateUserFields } from '../models/user.model';
import { comparePassword, hashPassword } from '../utils/hash';

export async function getProfileHandeler(
  req: Request<getProfileInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getProfileHandeler';

  try {
    const user = await findUserById(req.params.id);
    if (!user) throw newError(404, 'ไม่พบข้อมูลผู้ใช้งานในระบบ', true);

    const payload = omit(user.dataValues, privateUserFields);
    res.json(payload);
  } catch (error) {
    next(error);
  }
}

export async function updateProfileHandler(
  req: Request<{}, {}, updateProfileInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateProfileHandler';

  try {
    const update: Partial<User> = {
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      remark: req.body.remark,
    };

    const result = await updateUser(res.locals.userId!, update);
    if (!result[0]) throw newError(400, 'Update profile ไม่สำเร็จ');

    res.json({ message: 'Update profile สำเร็จ' });
  } catch (error) {
    next(error);
  }
}

export async function updatePasswordHandler(
  req: Request<{}, {}, updatePasswordInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updatePasswordHandler';
  try {
    const user = await findUserById(res.locals.userId!);
    if (!user) throw newError(404, 'ไม่พบข้อมูลผู้ใช้งานในระบบ');

    const compare = comparePassword(req.body.oldPassword, user.password);
    if (!compare) throw newError(400, 'รหัสผ่านเก่าไม่ถูกต้อง');

    const hash = hashPassword(req.body.newPassword);
    const result = await updateUserPassword(res.locals.userId!, hash);
    if (!result[0]) throw newError(400, 'Update password ไม่สำเร็จ');

    res.json({ message: 'Update password สำเร็จ' });
  } catch (error) {
    next(error);
  }
}

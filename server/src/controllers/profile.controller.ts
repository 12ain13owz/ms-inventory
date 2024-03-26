import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import {
  findUserByEmail,
  updateUser,
  updateUserPassword,
} from '../services/user.service';
import {
  UpdateProfileInput,
  UpdatePasswordInput,
} from '../schemas/profile.schema';
import {
  newError,
  comparePassword,
  hashPassword,
  normalizeUnique,
} from '../utils/helper';
import { omit } from 'lodash';
import { User, privateUserFields } from '../models/user.model';

export async function getProfileHandeler(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getProfileHandeler';

  try {
    const payload = omit(res.locals.user!, privateUserFields);
    res.json(payload);
  } catch (error) {
    next(error);
  }
}

export async function updateProfileHandler(
  req: Request<{}, {}, UpdateProfileInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateProfileHandler';

  try {
    const email = normalizeUnique(req.body.email);
    const user = await findUserByEmail(email);
    if (user && user.id !== res.locals.userId!)
      throw newError(
        400,
        'แก้ไข E-mail ไม่สำเร็จเนื่องจาก E-mail นี้มีอยู่ในระบบ'
      );

    const payload: Partial<User> = {
      email: email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      remark: req.body.remark || '',
    };

    const result = await updateUser(res.locals.userId!, payload);
    if (!result[0]) throw newError(400, 'แก้ไขโปรไฟล์ไม่สำเร็จ');

    res.json({ message: 'แก้ไขโปรไฟล์สำเร็จ' });
  } catch (error) {
    next(error);
  }
}

export async function updatePasswordHandler(
  req: Request<{}, {}, UpdatePasswordInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updatePasswordHandler';

  try {
    const compare = comparePassword(
      req.body.oldPassword,
      res.locals.user!.password
    );
    if (!compare) throw newError(400, 'รหัสผ่านเก่าไม่ถูกต้อง');

    const hash = hashPassword(req.body.newPassword);
    const result = await updateUserPassword(res.locals.userId!, hash);
    if (!result[0]) throw newError(400, 'อัพเดทรหัสผ่านไม่สำเร็จ');

    res.json({ message: 'อัพเดทรหัสสำเร็จ' });
  } catch (error) {
    next(error);
  }
}

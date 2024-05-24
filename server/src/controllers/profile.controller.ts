import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { userService } from '../services/user.service';
import { ProfileType } from '../schemas/profile.schema';
import {
  newError,
  comparePassword,
  hashPassword,
  normalizeUnique,
} from '../utils/helper';
import { omit } from 'lodash';
import { User, privateUserFields } from '../models/user.model';

export async function findProfileController(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'findProfileController';

  try {
    const resProfile = omit(res.locals.user, privateUserFields);
    res.json(resProfile);
  } catch (error) {
    next(error);
  }
}

export async function updateProfileController(
  req: Request<{}, {}, ProfileType['update']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateProfileController';

  try {
    const email = normalizeUnique(req.body.email);
    const user = await userService.findByEmail(email);
    if (user && user.id !== res.locals.userId)
      throw newError(
        400,
        `แก้ไข E-mail ไม่สำเร็จเนื่องจาก ${email} นี้มีอยู่ในระบบ`
      );

    const payload: Partial<User> = {
      email: email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      remark: req.body.remark || '',
    };

    const [result] = await userService.update(res.locals.userId!, payload);
    if (!result) throw newError(400, 'แก้ไขโปรไฟล์ไม่สำเร็จ');

    res.json({ message: 'แก้ไขโปรไฟล์สำเร็จ' });
  } catch (error) {
    next(error);
  }
}

export async function changePasswordController(
  req: Request<{}, {}, ProfileType['changePassword']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'changePasswordController';

  try {
    const compare = comparePassword(
      req.body.oldPassword,
      res.locals.user!.password
    );
    if (!compare) throw newError(400, 'รหัสผ่านเก่าไม่ถูกต้อง');

    const hash = hashPassword(req.body.newPassword);
    const [result] = await userService.changePassword(res.locals.userId!, hash);
    if (!result) throw newError(400, 'แก้ไขรหัสผ่านไม่สำเร็จ');

    res.json({ message: 'แก้ไขรหัสผ่านสำเร็จ' });
  } catch (error) {
    next(error);
  }
}

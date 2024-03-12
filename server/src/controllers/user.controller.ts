import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { omit } from 'lodash';
import {
  createUserInput,
  updateUserInput,
  updateUserPasswordInput,
} from '../schemas/user.schema';
import {
  comparePassword,
  hashPassword,
  newError,
  normalizeUnique,
} from '../utils/helper';
import {
  createUser,
  findAllUser,
  findUserByEmail,
  findUserById,
  updateUser,
  updateUserPassword,
} from '../services/user.service';
import { User, privateUserFields } from '../models/user.model';

export async function getAllUserHandler(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getAllUserHandler';

  try {
    const payload = await findAllUser();
    res.json(payload);
  } catch (error) {
    next(error);
  }
}

export async function createUserHandler(
  req: Request<{}, {}, createUserInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'createUserHandler';

  try {
    const email = normalizeUnique(req.body.email);
    const user = await findUserByEmail(email);
    if (user) throw newError(400, 'E-mail นี้มีอยู่ในระบบ');

    const password = hashPassword(req.body.password);
    const role = req.body.role as 'admin' | 'user';
    const payload: User = new User({
      id: null,
      email: email,
      password: password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      role: role,
      active: true,
      remark: req.body.remark || '',
    });

    const result = await createUser(payload);
    const newUser = omit(result.dataValues, privateUserFields);

    res.json({
      message: 'เพิ่มผู้ใช้งานสำเร็จ',
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserHandler(
  req: Request<updateUserInput['params'], {}, updateUserInput['body']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateUserHandler';

  try {
    const id = +req.params.id;
    const email = normalizeUnique(req.body.email);
    const user = await findUserByEmail(email);
    if (user && user.id !== id)
      throw newError(
        400,
        'แก้ไขโปรไฟล์ไม่สำเร็จเนื่องจาก E-mail นี้มีอยู่ในระบบ'
      );

    const role = req.body.role as 'admin' | 'user';
    const payload: Partial<User> = {
      email: email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      role: role,
      active: req.body.active,
      remark: req.body.remark || '',
    };

    const result = await updateUser(id, payload);
    if (!result[0]) throw newError(400, 'แก้ไขข้อมูลผู้ใช้งานไม่สำเร็จ');

    const updatedUser = { id, ...payload };
    res.json({ message: 'แก้ไขข้อมูลผู้ใช้งานสำเร็จ', user: updatedUser });
  } catch (error) {
    next(error);
  }
}

export async function updateUserPasswordHandler(
  req: Request<
    updateUserPasswordInput['params'],
    {},
    updateUserPasswordInput['body']
  >,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateUserPasswordHandler';

  try {
    const id = +req.params.id;
    const user = await findUserById(id);
    if (!user) throw newError(404, 'ไม่พบข้อมูลผู้ใช้งานในระบบ');

    const compare = comparePassword(
      req.body.oldPassword,
      user.dataValues.password
    );
    if (!compare) throw newError(400, 'รหัสผ่านเก่าไม่ถูกต้อง');

    const hash = hashPassword(req.body.newPassword);
    const result = await updateUserPassword(id, hash);
    if (!result[0]) throw newError(400, 'อัพเดทรหัสผ่านไม่สำเร็จ');

    res.json({ message: 'อัพเดทรหัสสำเร็จ' });
  } catch (error) {
    next(error);
  }
}

import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { omit } from 'lodash';
import {
  CreateUserInput,
  UpdateUserInput,
  UpdateUserPasswordInput,
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
    const resUsers = await findAllUser();
    res.json(resUsers);
  } catch (error) {
    next(error);
  }
}

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
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
      email: email,
      password: password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      role: role,
      active: true,
      remark: req.body.remark || '',
    });

    const result = await createUser(payload);
    const newUser = omit(result.toJSON(), privateUserFields);

    res.json({
      message: `เพิ่มผู้ใช้งาน ${email} สำเร็จ`,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserHandler(
  req: Request<UpdateUserInput['params'], {}, UpdateUserInput['body']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateUserHandler';

  try {
    const id = +req.params.id;
    const email = normalizeUnique(req.body.email);
    const existingUser = await findUserByEmail(email);
    if (existingUser && existingUser.id !== id)
      throw newError(
        400,
        `แก้ไข E-mail ไม่สำเร็จเนื่องจาก ${email} นี้มีอยู่ในระบบ`
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

    res.json({
      message: `แก้ไขข้อมูลผู้ใช้งาน ${email} สำเร็จ`,
      user: payload,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserPasswordHandler(
  req: Request<
    UpdateUserPasswordInput['params'],
    {},
    UpdateUserPasswordInput['body']
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
      user.toJSON().password
    );
    if (!compare) throw newError(400, 'รหัสผ่านเก่าไม่ถูกต้อง');

    const hash = hashPassword(req.body.newPassword);
    const result = await updateUserPassword(id, hash);
    if (!result[0]) throw newError(400, 'แก้ไขรหัสผ่านไม่สำเร็จ');

    res.json({ message: 'แก้ไขรหัสผ่านสำเร็จ' });
  } catch (error) {
    next(error);
  }
}

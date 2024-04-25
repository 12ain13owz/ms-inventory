import config from 'config';
import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { omit } from 'lodash';
import { readFileSync } from 'fs';
import path from 'path';
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  UpdateUserInput,
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
  resetUserPassword,
  updateUser,
} from '../services/user.service';
import { User, privateUserFields } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../utils/mailer';

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
    if (user) throw newError(400, `E-mail: ${email} นี้มีอยู่ในระบบ`);

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

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'forgotPasswordHandler';

  try {
    const email = normalizeUnique(req.body.email);
    const user = await findUserByEmail(email);
    if (!user) throw newError(404, 'ไม่พบ E-mail');

    const createdAt = new Date();
    const passwordResetCode = uuidv4().substring(0, 8);
    const from = config.get<string>('smtp.user');

    user.passwordResetCode = passwordResetCode;
    user.passwordExpired = new Date(createdAt.getTime() + 1000 * 60 * 60 * 1);

    const pathTemplate = path.join(__dirname, '../utils/email-template.html');
    const emailTemplate = readFileSync(pathTemplate, 'utf8');
    const html = emailTemplate.replace(
      '{{ passwordResetCode }}',
      passwordResetCode
    );

    const payload = {
      from: from,
      to: email,
      subject: 'ระบบคลังพัสดุ เปลี่ยนรหัสผ่าน',
      html: html,
    };

    await user.save();
    const result = await sendEmail(payload);
    if (!result)
      throw newError(503, `ส่งรหัสยืนยัน E-mail: ${email} ไม่สำเร็จ`);

    res.json({ message: `ส่งรหัสยืนยัน E-mail: ${email} สำเร็จ`, id: user.id });
  } catch (error) {
    next(error);
  }
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'resetPasswordHandler';

  try {
    const id = +req.params.id;
    const passwordResetCode = req.body.passwordResetCode;
    const user = await findUserById(id);
    if (!user) throw newError(404, 'ไม่พบข้อมูลผู้ใช้งานในระบบ');
    if (!user.passwordResetCode)
      throw newError(
        400,
        'ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาส่ง E-mail เพื่อขอเปลี่ยนรหัส'
      );
    if (user.passwordResetCode !== passwordResetCode)
      throw newError(404, 'รหัสยืนยันไม่ถูกต้อง กรุณาตรวจสอบ');

    const createdAt = new Date().getTime();
    const passwordExpired = user.passwordExpired!.getTime();

    if (createdAt > passwordExpired) {
      user.passwordResetCode = null;
      user.passwordExpired = null;
      await user.save();
      throw newError(400, 'รหัสยืนยันหมดอายุ');
    }

    const hash = hashPassword(req.body.newPassword);
    const result = await resetUserPassword(id, hash);
    if (!result[0]) throw newError(400, 'เปลี่ยนรหัสผ่านไม่สำเร็จ');

    res.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
  } catch (error) {
    next(error);
  }
}

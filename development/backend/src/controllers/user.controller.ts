import { config } from "../../config";
import { NextFunction, Request } from "express";
import { ExtendedResponse } from "../types/express";
import { omit } from "lodash";
import { readFileSync } from "fs";
import { join } from "path";
import { UserType } from "../schemas/user.schema";
import { hashPassword, newError, normalizeUnique } from "../utils/helper";
import { userService } from "../services/user.service";
import { User, privateUserFields } from "../models/user.model";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../utils/mailer";

export async function findAllUserController(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = "findAllUserController";

  try {
    const resUsers = await userService.findAll();
    res.json(resUsers);
  } catch (error) {
    next(error);
  }
}

export async function createUserController(
  req: Request<{}, {}, UserType["create"]>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = "createUserController";

  try {
    const email = normalizeUnique(req.body.email);
    const user = await userService.findByEmail(email);
    if (user) throw newError(400, `E-mail: ${email} นี้มีอยู่ในระบบ`);

    const password = hashPassword(req.body.password);
    const role = req.body.role as "admin" | "user";
    const payload: User = new User({
      email: email,
      password: password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      role: role,
      active: req.body.active,
      remark: req.body.remark ?? "",
    });

    const result = await userService.create(payload);
    const newUser = omit(result.toJSON(), privateUserFields);

    res.json({
      message: `เพิ่มผู้ใช้งาน ${email} สำเร็จ`,
      item: newUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserController(
  req: Request<UserType["update"]["params"], {}, UserType["update"]["body"]>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = "updateUserController";

  try {
    const id = +req.params.id;
    const email = normalizeUnique(req.body.email);
    const existingUser = await userService.findByEmail(email);
    if (existingUser && existingUser.id !== id)
      throw newError(
        400,
        `แก้ไข E-mail ไม่สำเร็จเนื่องจาก ${email} นี้มีอยู่ในระบบ`
      );

    const role = req.body.role as "admin" | "user";
    const payload: Partial<User> = {
      email: email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      role: role,
      active: req.body.active,
      remark: req.body.remark ?? "",
    };
    const [result] = await userService.update(id, payload);
    if (!result) throw newError(400, `แก้ไขข้อมูลผู้ใช้งาน ${email} ไม่สำเร็จ`);

    res.json({
      message: `แก้ไขข้อมูลผู้ใช้งาน ${email} สำเร็จ`,
      item: payload,
    });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassworController(
  req: Request<{}, {}, UserType["forgotPassword"]>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = "forgotPassworController";

  try {
    const email = normalizeUnique(req.body.email);
    const user = await userService.findByEmail(email);
    if (!user) throw newError(404, "ไม่พบ E-mail");

    const createdAt = new Date();
    const passwordResetCode = uuidv4().substring(0, 8);
    const from = config.get("mailer").user;

    user.passwordResetCode = passwordResetCode;
    user.passwordExpired = new Date(createdAt.getTime() + 1000 * 60 * 60 * 1);

    const pathTemplate = join(__dirname, "../templates/email-template.html");
    const emailTemplate = readFileSync(pathTemplate, "utf8");
    const html = emailTemplate.replace(
      "{{ passwordResetCode }}",
      passwordResetCode
    );

    const payload = {
      from: from,
      to: email,
      subject: "ระบบคลังพัสดุ เปลี่ยนรหัสผ่าน",
      html: html,
    };

    await user.save();
    const info = await sendEmail(payload);
    if (!info) throw newError(503, `ส่งรหัสยืนยัน E-mail: ${email} ไม่สำเร็จ`);

    res.json({ message: `ส่งรหัสยืนยัน E-mail: ${email} สำเร็จ`, id: user.id });
  } catch (error) {
    next(error);
  }
}

export async function resetPasswordController(
  req: Request<
    UserType["resetPassword"]["params"],
    {},
    UserType["resetPassword"]["body"]
  >,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = "resetPasswordController";

  try {
    const id = +req.params.id;
    const passwordResetCode = req.body.passwordResetCode;
    const user = await userService.findById(id);

    if (!user) throw newError(404, "ไม่พบข้อมูลผู้ใช้งานในระบบ");
    if (!user.passwordResetCode)
      throw newError(
        400,
        "ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาส่ง E-mail เพื่อขอเปลี่ยนรหัส"
      );
    if (user.passwordResetCode !== passwordResetCode)
      throw newError(404, "รหัสยืนยันไม่ถูกต้อง กรุณาตรวจสอบ");

    const createdAt = new Date().getTime();
    const passwordExpired = user.passwordExpired!.getTime();

    if (createdAt > passwordExpired) {
      user.passwordResetCode = null;
      user.passwordExpired = null;
      await user.save();
      throw newError(400, "รหัสยืนยันหมดอายุ");
    }

    const hash = hashPassword(req.body.newPassword);
    const [result] = await userService.resetPassword(id, hash);
    if (!result) throw newError(400, "เปลี่ยนรหัสผ่านไม่สำเร็จ");

    res.json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
  } catch (error) {
    next(error);
  }
}

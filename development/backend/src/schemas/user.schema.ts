import { TypeOf, boolean, object, string } from 'zod';

const regexPassword = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
);
const regexId = new RegExp(/^[0-9]\d*$/);

const id = 'ไม่พบข้อมูลผู้ใช้ในระบบ';
const email = 'ไม่พบ E-mail';
const emailInvalid = 'รูปแบบ E-mail ไม่ถูกต้อง';
const firstname = 'ไม่พบชื่อผู้ใช้งาน';
const lastname = 'ไม่พบนามสกุลผู้ใช้งาน';
const role = 'ไม่พบสิทธิผู้ใช้งาน';
const roleAccess = 'กรุณาเลือกสิทธิ admin หรือ user';
const active = 'ไม่พบสถานะการใช้งาน';
const password = 'ไม่พบรหัสผ่าน';
const newPassword = 'ไม่พบรหัสผ่านใหม่';
const confirmPassword = 'ไม่พบยืนยันรหัสผ่าน';
const regexInValid =
  'รูปแบบรหัสผ่านไม่ถูกต้อง! ต้องมีตัวเล็ก, ตัวใหญ่, ตัวเลข, อักษรพิเศษ และไม่ต่ำกว่า 8 ตัวอักษร';
const comparePassword = 'รหัสผ่านไม่ตรงกัน';
const passwordResetCode = 'ไม่พบรหัสยืนยัน';

export const userSchema = {
  create: object({
    body: object({
      email: string({ required_error: email }).email({ message: emailInvalid }),
      password: string({ required_error: password }).regex(regexPassword, {
        message: regexInValid,
      }),
      confirmPassword: string({ required_error: confirmPassword }),
      firstname: string({ required_error: firstname }).min(1, {
        message: firstname,
      }),
      lastname: string({ required_error: lastname }).min(1, {
        message: lastname,
      }),
      role: string({ required_error: role })
        .min(1, { message: role })
        .refine((role) => role === 'admin' || role === 'user', {
          message: roleAccess,
        }),
      active: boolean({ required_error: active }),
      remark: string().optional().nullable(),
    }).refine((data) => data.password === data.confirmPassword, {
      message: comparePassword,
      path: ['confirmPassword'],
    }),
  }),

  update: object({
    params: object({
      id: string({ required_error: id })
        .min(1, { message: id })
        .regex(regexId, { message: id }),
    }),
    body: object({
      email: string({ required_error: email }).email({ message: emailInvalid }),
      firstname: string({ required_error: firstname }).min(1, {
        message: firstname,
      }),
      lastname: string({ required_error: lastname }).min(1, {
        message: lastname,
      }),
      role: string({ required_error: role })
        .min(1, { message: role })
        .refine((role) => role === 'admin' || role === 'user', {
          message: roleAccess,
        }),
      active: boolean({ required_error: active }),
      remark: string().optional().nullable(),
    }),
  }),

  forgotPassword: object({
    body: object({
      email: string({ required_error: email }).email(emailInvalid),
    }),
  }),

  resetPassword: object({
    params: object({
      id: string({ required_error: id })
        .min(1, { message: id })
        .regex(regexId, { message: id }),
    }),
    body: object({
      passwordResetCode: string({ required_error: passwordResetCode }).min(1, {
        message: passwordResetCode,
      }),
      newPassword: string({ required_error: newPassword }).regex(
        regexPassword,
        {
          message: regexInValid,
        }
      ),
      confirmPassword: string({ required_error: confirmPassword }),
    }).refine((data) => data.newPassword === data.confirmPassword, {
      message: comparePassword,
      path: ['confirmPassword'],
    }),
  }),
};

export type UserType = {
  create: TypeOf<typeof userSchema.create>['body'];
  update: TypeOf<typeof userSchema.update>;
  forgotPassword: TypeOf<typeof userSchema.forgotPassword>['body'];
  resetPassword: TypeOf<typeof userSchema.resetPassword>;
};

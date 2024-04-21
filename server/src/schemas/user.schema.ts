import { TypeOf, boolean, object, string } from 'zod';

const id = 'ไม่พบข้อมูลผู้ใช้ในระบบ';
const email = 'ไม่พบข้อมูล E-mail';
const emailInvalid = 'รูปแบบ E-mail ไม่ถูกต้อง';
const firstname = 'ไม่พบข้อมูลชื่อผู้ใช้งาน';
const lastname = 'ไม่พบข้อมูลนามสกุลผู้ใช้งาน';
const role = 'ไม่พบข้อมูลสิทธิผู้ใช้งาน';
const roleAccess = 'กรุณาเลือกสิทธิ admin หรือ user';
const active = 'ไม่พบข้อมูลสถานะการใช้งาน';
const password = 'ไม่พบข้อมูลรหัสผ่าน';
const oldPassword = 'ไม่พบข้อมูลรหัสผ่านเก่า';
const newPassword = 'ไม่พบข้อมูลรหัสผ่านใหม่';
const confirmPassword = 'ไม่พบข้อมูลยืนยันรหัสผ่าน';
const regexInValid =
  'รูปแบบรหัสผ่านไม่ถูกต้อง! ต้องมีตัวเล็ก, ตัวใหญ่, ตัวเลข, อักษรพิเศษ และไม่ต่ำกว่า 8 ตัวอักษร';
const comparePassword = 'รหัสผ่านไม่ตรงกัน';

const regexPassword = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
);
const regexId = new RegExp(/^[0-9]\d*$/);

export const createUserSchema = object({
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
      .refine((value) => value === 'admin' || value === 'user', {
        message: roleAccess,
      }),
    active: boolean({ required_error: active }),
    remark: string().optional().nullable(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: comparePassword,
    path: ['confirmPassword'],
  }),
});

export const updateUserSchema = object({
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
      .refine((value) => value === 'admin' || value === 'user', {
        message: roleAccess,
      }),
    active: boolean({ required_error: active }),
    remark: string().optional().nullable(),
  }),
});

export const updateUserPasswordSchema = object({
  params: object({
    id: string({ required_error: id })
      .min(1, { message: id })
      .regex(regexId, { message: id }),
  }),
  body: object({
    oldPassword: string({ required_error: oldPassword }),
    newPassword: string({ required_error: newPassword }).regex(regexPassword, {
      message: regexInValid,
    }),
    confirmPassword: string({ required_error: confirmPassword }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: comparePassword,
    path: ['confirmPassword'],
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type UpdateUserInput = TypeOf<typeof updateUserSchema>;
export type UpdateUserPasswordInput = TypeOf<typeof updateUserPasswordSchema>;

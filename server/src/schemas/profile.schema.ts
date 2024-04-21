import { TypeOf, object, string } from 'zod';

const email = 'ไม่พบข้อมูล E-mail';
const emailInvalid = 'รูปแบบ E-mail ไม่ถูกต้อง';
const firstname = 'ไม่พบข้อมูลชื่อผู้ใช้งาน';
const lastname = 'ไม่พบข้อมูลนามสกุลผู้ใช้งาน';

const oldPassword = 'ไม่พบข้อมูลรหัสผ่านเก่า';
const newPassword = 'ไม่พบข้อมูลรหัสผ่านใหม่';
const confirmPassword = 'ไม่พบข้อมูลยืนยันรหัสผ่าน';
const regexInValid =
  'รูปแบบรหัสผ่านไม่ถูกต้อง! ต้องมีตัวเล็ก, ตัวใหญ่, ตัวเลข, อักษรพิเศษ และไม่ต่ำกว่า 8 ตัวอักษร';
const comparePassword = 'รหัสผ่านไม่ตรงกัน';

const regexPassword = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
);

export const updateProfileSchema = object({
  body: object({
    email: string({ required_error: email }).email({ message: emailInvalid }),
    firstname: string({ required_error: firstname }).min(1, {
      message: firstname,
    }),
    lastname: string({ required_error: lastname }).min(1, {
      message: lastname,
    }),
    remark: string().optional().nullable(),
  }),
});

export const updatePasswordSchema = object({
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

export type UpdateProfileInput = TypeOf<typeof updateProfileSchema>['body'];
export type UpdatePasswordInput = TypeOf<typeof updatePasswordSchema>['body'];

import { TypeOf, object, string, boolean } from 'zod';

export const getProfileSchema = object({
  params: object({
    id: string({ required_error: 'ไม่พบข้อมูลผู้ใช้ในระบบ' })
      .min(1, { message: 'ไม่พบข้อมูลผู้ใช้ในระบบ' })
      .transform(Number),
  }),
});

export const updateProfileSchema = object({
  body: object({
    email: string({ required_error: 'ไม่พบข้อมูล E-mail' })
      .min(1, {
        message: 'ไม่พบข้อมูล E-mail',
      })
      .email({ message: 'รูปแบบ E-mail ไม่ถูกต้อง' }),
    firstname: string({ required_error: 'ไม่พบข้อมูล First name' }).min(1, {
      message: 'ไม่พบข้อมูล First name',
    }),
    lastname: string({ required_error: 'ไม่พบข้อมูล Last name' }).min(1, {
      message: 'ไม่พบข้อมูล Last name',
    }),
    role: string().optional(),
    active: boolean().optional(),
    remark: string({ required_error: 'ไม่พบข้อมูล Remark' }),
  }),
});

// ต้องมี ตัวเล็ก, ตัวใหญ่, ตัวเลข, อักษรพิเศษ และไม่ต่ำกว่า 8 ตัวอักษร
const regexPassword = new RegExp(
  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'
);
export const updatePasswordSchema = object({
  body: object({
    oldPassword: string({ required_error: 'ไม่พบข้อมูล Old password' }),
    newPassword: string({ required_error: 'ไม่พบข้อมูล New password' }).regex(
      regexPassword,
      {
        message:
          'รูปแบบ Password ไม่ถูกต้อง! ต้องมีตัวเล็ก, ตัวใหญ่, ตัวเลข, อักษรพิเศษ และไม่ต่ำกว่า 8 ตัวอักษร',
      }
    ),
    confirmPassword: string({ required_error: 'ไม่พบข้อมูล Confirm password' }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password ไม่ตรงกัน',
    path: ['confirmPassword'],
  }),
});

export type getProfileInput = TypeOf<typeof getProfileSchema>['params'];
export type updateProfileInput = TypeOf<typeof updateProfileSchema>['body'];
export type updatePasswordInput = TypeOf<typeof updatePasswordSchema>['body'];

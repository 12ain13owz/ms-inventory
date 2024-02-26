import { TypeOf, object, string, number } from 'zod';

export const LoginUserSchema = object({
  body: object({
    email: string({
      required_error: 'กรุณาระบุ Email',
    }).email('รูปแบบของ Email ไม่ถูกต้อง'),
    password: string({
      required_error: 'กรุณาระบุ Password',
    }).min(1, { message: 'กรุณาระบุ Password' }),
  }),
});

export type LoginUserInput = TypeOf<typeof LoginUserSchema>['body'];

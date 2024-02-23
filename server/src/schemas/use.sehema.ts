import { TypeOf, object, string } from 'zod';

export const LoginUserSchema = object({
  body: object({
    email: string({
      required_error: 'กรุณาระบุ Email ค่ะ',
    }).email('รูปแบบของ Email ไม่ถูกต้องค่ะ'),
    password: string({
      required_error: 'กรุณาระบุ Password ค่ะ',
    }),
    receptchaToken: string({}),
  }),
});

export type LoginUserInput = TypeOf<typeof LoginUserSchema>['body'];

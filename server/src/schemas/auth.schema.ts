import { TypeOf, object, string } from 'zod';

export const LoginUserSchema = object({
  body: object({
    email: string({
      required_error: 'กรุณาระบุ E-mail',
    }).email('รูปแบบ E-mail ไม่ถูกต้อง'),
    password: string({
      required_error: 'กรุณาระบุรหัสผ่าน',
    }),
  }),
});

export type LoginUserInput = TypeOf<typeof LoginUserSchema>['body'];

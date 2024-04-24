import { TypeOf, object, string } from 'zod';

const email = 'กรุณาระบุ E-mail';
const password = 'กรุณาระบุรหัสผ่าน';
const recaptcha = 'ไม่พบ recaptcha';

export const LoginUserSchema = object({
  body: object({
    email: string({ required_error: email }),
    password: string({ required_error: password }),
    recaptcha: string({ required_error: recaptcha }),
  }),
});

export type LoginUserInput = TypeOf<typeof LoginUserSchema>['body'];

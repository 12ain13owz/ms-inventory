import { TypeOf, object, string } from 'zod';

const email = 'กรุณาระบุ E-mail';
const emailInvalid = 'รูปแบบ E-mail ไม่ถูกต้อง';
const password = 'กรุณาระบุ รหัสผ่าน';
const recaptcha = 'ไม่พบ recaptcha';

export const authSehema = {
  login: object({
    body: object({
      email: string({ required_error: email }).email(emailInvalid),
      password: string({ required_error: password }),
      recaptcha: string({ required_error: recaptcha }),
    }),
  }),
};

export type AuthType = { login: TypeOf<typeof authSehema.login>['body'] };

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSehema = void 0;
const zod_1 = require("zod");
const email = 'กรุณาระบุ E-mail';
const emailInvalid = 'รูปแบบ E-mail ไม่ถูกต้อง';
const password = 'กรุณาระบุ รหัสผ่าน';
const recaptcha = 'ไม่พบ recaptcha';
exports.authSehema = {
    login: (0, zod_1.object)({
        body: (0, zod_1.object)({
            email: (0, zod_1.string)({ required_error: email }).email(emailInvalid),
            password: (0, zod_1.string)({ required_error: password }),
            recaptcha: (0, zod_1.string)({ required_error: recaptcha }),
        }),
    }),
};

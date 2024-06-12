"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
const regexPassword = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/);
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
const regexInValid = 'รูปแบบรหัสผ่านไม่ถูกต้อง! ต้องมีตัวเล็ก, ตัวใหญ่, ตัวเลข, อักษรพิเศษ และไม่ต่ำกว่า 8 ตัวอักษร';
const comparePassword = 'รหัสผ่านไม่ตรงกัน';
const passwordResetCode = 'ไม่พบรหัสยืนยัน';
exports.userSchema = {
    create: (0, zod_1.object)({
        body: (0, zod_1.object)({
            email: (0, zod_1.string)({ required_error: email }).email({ message: emailInvalid }),
            password: (0, zod_1.string)({ required_error: password }).regex(regexPassword, {
                message: regexInValid,
            }),
            confirmPassword: (0, zod_1.string)({ required_error: confirmPassword }),
            firstname: (0, zod_1.string)({ required_error: firstname }).min(1, {
                message: firstname,
            }),
            lastname: (0, zod_1.string)({ required_error: lastname }).min(1, {
                message: lastname,
            }),
            role: (0, zod_1.string)({ required_error: role })
                .min(1, { message: role })
                .refine((role) => role === 'admin' || role === 'user', {
                message: roleAccess,
            }),
            active: (0, zod_1.boolean)({ required_error: active }),
            remark: (0, zod_1.string)().optional().nullable(),
        }).refine((data) => data.password === data.confirmPassword, {
            message: comparePassword,
            path: ['confirmPassword'],
        }),
    }),
    update: (0, zod_1.object)({
        params: (0, zod_1.object)({
            id: (0, zod_1.string)({ required_error: id })
                .min(1, { message: id })
                .regex(regexId, { message: id }),
        }),
        body: (0, zod_1.object)({
            email: (0, zod_1.string)({ required_error: email }).email({ message: emailInvalid }),
            firstname: (0, zod_1.string)({ required_error: firstname }).min(1, {
                message: firstname,
            }),
            lastname: (0, zod_1.string)({ required_error: lastname }).min(1, {
                message: lastname,
            }),
            role: (0, zod_1.string)({ required_error: role })
                .min(1, { message: role })
                .refine((role) => role === 'admin' || role === 'user', {
                message: roleAccess,
            }),
            active: (0, zod_1.boolean)({ required_error: active }),
            remark: (0, zod_1.string)().optional().nullable(),
        }),
    }),
    forgotPassword: (0, zod_1.object)({
        body: (0, zod_1.object)({
            email: (0, zod_1.string)({ required_error: email }).email(emailInvalid),
        }),
    }),
    resetPassword: (0, zod_1.object)({
        params: (0, zod_1.object)({
            id: (0, zod_1.string)({ required_error: id })
                .min(1, { message: id })
                .regex(regexId, { message: id }),
        }),
        body: (0, zod_1.object)({
            passwordResetCode: (0, zod_1.string)({ required_error: passwordResetCode }).min(1, {
                message: passwordResetCode,
            }),
            newPassword: (0, zod_1.string)({ required_error: newPassword }).regex(regexPassword, {
                message: regexInValid,
            }),
            confirmPassword: (0, zod_1.string)({ required_error: confirmPassword }),
        }).refine((data) => data.newPassword === data.confirmPassword, {
            message: comparePassword,
            path: ['confirmPassword'],
        }),
    }),
};

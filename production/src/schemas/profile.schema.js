"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileSchema = void 0;
const zod_1 = require("zod");
const regexPassword = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/);
const email = 'ไม่พบข้อมูล E-mail';
const emailInvalid = 'รูปแบบ E-mail ไม่ถูกต้อง';
const firstname = 'ไม่พบชื่อผู้ใช้งาน';
const lastname = 'ไม่พบนามสกุลผู้ใช้งาน';
const oldPassword = 'ไม่พบรหัสผ่านเก่า';
const newPassword = 'ไม่พบรหัสผ่านใหม่';
const confirmPassword = 'ไม่พบยืนยันรหัสผ่าน';
const regexInValid = 'รูปแบบรหัสผ่านไม่ถูกต้อง! ต้องมีตัวเล็ก, ตัวใหญ่, ตัวเลข, อักษรพิเศษ และไม่ต่ำกว่า 8 ตัวอักษร';
const comparePassword = 'รหัสผ่านไม่ตรงกัน';
exports.profileSchema = {
    update: (0, zod_1.object)({
        body: (0, zod_1.object)({
            email: (0, zod_1.string)({ required_error: email }).email({ message: emailInvalid }),
            firstname: (0, zod_1.string)({ required_error: firstname }).min(1, {
                message: firstname,
            }),
            lastname: (0, zod_1.string)({ required_error: lastname }).min(1, {
                message: lastname,
            }),
            remark: (0, zod_1.string)().optional().nullable(),
        }),
    }),
    changePassword: (0, zod_1.object)({
        body: (0, zod_1.object)({
            oldPassword: (0, zod_1.string)({ required_error: oldPassword }),
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

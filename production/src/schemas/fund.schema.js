"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fundSchema = void 0;
const zod_1 = require("zod");
const regexId = new RegExp(/^[0-9]\d*$/);
const id = 'ไม่พบแหล่งเงิน';
const name = 'ไม่พบแหล่งเงิน';
const active = 'ไม่พบสถานะการใช้งาน';
exports.fundSchema = {
    create: (0, zod_1.object)({
        body: (0, zod_1.object)({
            name: (0, zod_1.string)({ required_error: name }).min(1, {
                message: name,
            }),
            active: (0, zod_1.boolean)({ required_error: active }),
            remark: (0, zod_1.string)().optional().nullable(),
        }),
    }),
    update: (0, zod_1.object)({
        params: (0, zod_1.object)({
            id: (0, zod_1.string)({ required_error: id })
                .min(1, { message: id })
                .regex(regexId, { message: id }),
        }),
        body: (0, zod_1.object)({
            name: (0, zod_1.string)({ required_error: id }).min(1, {
                message: id,
            }),
            active: (0, zod_1.boolean)({ required_error: active }),
            remark: (0, zod_1.string)().optional().nullable(),
        }),
    }),
    delete: (0, zod_1.object)({
        params: (0, zod_1.object)({
            id: (0, zod_1.string)({ required_error: id })
                .min(1, { message: id })
                .regex(regexId, { message: id }),
        }),
    }),
};

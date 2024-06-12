"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSchema = void 0;
const zod_1 = require("zod");
const regexNumber = new RegExp(/^[0-9]\d*$/);
const id = 'ไม่พบครุภัณฑ์';
const dateStart = 'ไม่พบวันที่เริ่มต้นในการค้นหา';
const dateEnd = 'ไม่พบวันที่สิ้นสุดในการค้นหา';
const track = 'ไม่พบเลข Track';
const code = 'ไม่พบรหัสครุภัณฑ์';
exports.logSchema = {
    search: (0, zod_1.object)({
        query: (0, zod_1.object)({
            code: (0, zod_1.string)({ required_error: code }),
        }),
    }),
    findByDate: (0, zod_1.object)({
        params: (0, zod_1.object)({
            dateStart: (0, zod_1.string)({ required_error: dateStart }).min(1, {
                message: dateStart,
            }),
            dateEnd: (0, zod_1.string)({ required_error: dateEnd }).min(1, {
                message: dateEnd,
            }),
        }),
    }),
    findByTrack: (0, zod_1.object)({
        params: (0, zod_1.object)({
            track: (0, zod_1.string)({ required_error: track }).min(1, {
                message: track,
            }),
        }),
    }),
    findByCode: (0, zod_1.object)({
        params: (0, zod_1.object)({
            code: (0, zod_1.string)({ required_error: code }).min(1, {
                message: code,
            }),
        }),
    }),
    findById: (0, zod_1.object)({
        params: (0, zod_1.object)({
            id: (0, zod_1.string)({ required_error: id })
                .min(1, {
                message: id,
            })
                .regex(regexNumber, { message: id }),
        }),
    }),
};

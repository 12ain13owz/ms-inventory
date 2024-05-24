import { TypeOf, boolean, object, string } from 'zod';

const regexNumber = new RegExp(/^[0-9]\d*$/);

const id = 'ไม่พบคุณสมบัติ (ยี่ห้อ/รุ่น)';
const name = 'ไม่พบคุณสมบัติ (ยี่ห้อ/รุ่น)';
const active = 'ไม่พบสถานะการใช้งาน';

export const categorySehema = {
  create: object({
    body: object({
      name: string({ required_error: name }).min(1, { message: name }),
      active: boolean({ required_error: active }),
      remark: string().optional().nullable(),
    }),
  }),

  update: object({
    params: object({
      id: string({ required_error: id })
        .min(1, { message: id })
        .regex(regexNumber, { message: id }),
    }),
    body: object({
      name: string({ required_error: id }).min(1, { message: id }),
      active: boolean({ required_error: active }),
      remark: string().optional().nullable(),
    }),
  }),

  delete: object({
    params: object({
      id: string({ required_error: id })
        .min(1, { message: id })
        .regex(regexNumber, { message: id }),
    }),
  }),
};

export type CategoryType = {
  create: TypeOf<typeof categorySehema.create>['body'];
  update: TypeOf<typeof categorySehema.update>;
  delete: TypeOf<typeof categorySehema.delete>['params'];
};

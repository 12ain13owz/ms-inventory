import { TypeOf, boolean, object, string } from 'zod';

const regexId = new RegExp(/^[0-9]\d*$/);

const id = 'ไม่พบห้อง';
const name = 'ไม่พบห้อง/จัดเก็บ';
const active = 'ไม่พบสถานะการใช้งาน';

export const locationSchema = {
  create: object({
    body: object({
      name: string({ required_error: name }).min(1, {
        message: name,
      }),
      active: boolean({ required_error: active }),
      remark: string().optional().nullable(),
    }),
  }),

  update: object({
    params: object({
      id: string({ required_error: id })
        .min(1, { message: id })
        .regex(regexId, { message: id }),
    }),
    body: object({
      name: string({ required_error: id }).min(1, {
        message: id,
      }),
      active: boolean({ required_error: active }),
      remark: string().optional().nullable(),
    }),
  }),

  delete: object({
    params: object({
      id: string({ required_error: id })
        .min(1, { message: id })
        .regex(regexId, { message: id }),
    }),
  }),
};

export type LocationType = {
  create: TypeOf<typeof locationSchema.create>['body'];
  update: TypeOf<typeof locationSchema.update>;
  delete: TypeOf<typeof locationSchema.delete>['params'];
};

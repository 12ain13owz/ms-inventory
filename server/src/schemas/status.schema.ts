import { TypeOf, boolean, object, string } from 'zod';

const id = 'ไม่พบข้อมูลรหัสสถานะของอุปกรณ์';
const name = 'ไม่พบข้อมูลชื่อสถานะของอุปกรณ์';
const active = 'ไม่พบข้อมูลสถานะการใช้งาน';
const regexId = new RegExp(/^[0-9]\d*$/);

export const creatStatusSchema = object({
  body: object({
    name: string({ required_error: name }).min(1, {
      message: name,
    }),
    active: boolean({ required_error: active }),
    remark: string().optional().nullable(),
  }),
});

export const updateStatusSchema = object({
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
});

export const deleteStatusSchema = object({
  params: object({
    id: string({ required_error: id })
      .min(1, { message: id })
      .regex(regexId, { message: id }),
  }),
});

export type CreateStatusInput = TypeOf<typeof creatStatusSchema>['body'];
export type UpdateStatusInput = TypeOf<typeof updateStatusSchema>;
export type DeleteStatusInput = TypeOf<typeof deleteStatusSchema>['params'];

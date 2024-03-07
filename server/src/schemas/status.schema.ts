import { TypeOf, boolean, number, object, string } from 'zod';

const id = 'ไม่พบข้อมูลรหัสสถานะของอุปกรณ์';
const name = 'ไม่พบข้อมูลชื่อสถานะของอุปกรณ์';
const active = 'ไม่พบข้อมูลสถานะการใช้งาน';

export const creatStatusSchema = object({
  body: object({
    name: string({ required_error: name }).min(1, {
      message: name,
    }),
    place: string().optional().nullable(),
    active: boolean({ required_error: active }),
    remark: string().optional().nullable(),
  }),
});

export const updateStatusSchema = object({
  body: object({
    id: number({ required_error: id }).min(1, {
      message: id,
    }),
    name: string({ required_error: id }).min(1, {
      message: id,
    }),
    place: string().optional().nullable(),
    active: boolean({ required_error: active }),
    remark: string().optional().nullable(),
  }),
});

export const deleteStatusSchema = object({
  params: object({
    id: string({ required_error: id })
      .min(1, { message: id })
      .transform(Number),
  }),
});

export type createStatusInput = TypeOf<typeof creatStatusSchema>['body'];
export type updateStatusInput = TypeOf<typeof updateStatusSchema>['body'];
export type deleteStatusInput = TypeOf<typeof deleteStatusSchema>['params'];

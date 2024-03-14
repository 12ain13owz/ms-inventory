import { TypeOf, boolean, number, object, string } from 'zod';

const id = 'ไม่พบข้อมูลรหัสประเภทของอุปกรณ์';
const name = 'ไม่พบข้อมูลชื่อประเภทของอุปกรณ์';
const active = 'ไม่พบข้อมูลสถานะการใช้งาน';
const regexId = new RegExp(/^[0-9]\d*$/);

export const creatCategorySchema = object({
  body: object({
    name: string({ required_error: name }).min(1, {
      message: name,
    }),
    active: boolean({ required_error: active }),
    remark: string().optional().nullable(),
  }),
});

export const updateCategorySchema = object({
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

export const deleteCategorySchema = object({
  params: object({
    id: string({ required_error: id })
      .min(1, { message: id })
      .regex(regexId, { message: id }),
  }),
});

export type createCategoryInput = TypeOf<typeof creatCategorySchema>['body'];
export type updateCategoryInput = TypeOf<typeof updateCategorySchema>;
export type deleteCategoryInput = TypeOf<typeof deleteCategorySchema>['params'];

import { number, object, string, TypeOf } from 'zod';

const id = 'ไม่พบข้อมูลรหัสพัสดุ';
const code = 'ไม่พบข้อมูลรหัสพัสดุ';
const receivedDate = 'ไม่พบวันที่ได้รับพัสดุ';
const detail = 'ไม่พบรายละเอียดพัสดุ';
const quantity = 'ไม่พบจำนวนของพัสดุ';
const reduce = 'ไม่พบจำนวนของพัสดุที่ต้องการตัด stock ';
const categoryId = 'ไม่พบประเภทพัสดุ';
const categoryName = 'ไม่พบชื่อของประเภทพัสดุ';
const statusId = 'ไม่พบสถานะพัสดุ';
const statusName = 'ไม่พบชื่อของสถานะพัสดุ';

const regexId = new RegExp(/^[0-9]\d*$/);

export const createParcelSchema = object({
  body: object({
    code: string({ required_error: code }).min(1, {
      message: code,
    }),
    oldCode: string().optional().nullable(),
    receivedDate: string({ required_error: receivedDate }),
    detail: string({ required_error: detail }).min(1, {
      message: detail,
    }),
    quantity: string({ required_error: quantity }).min(1, {
      message: quantity,
    }),
    remark: string().optional().nullable(),
    image: string().optional().nullable(),
    categoryId: string({ required_error: categoryId }).min(1, {
      message: categoryId,
    }),
    categoryName: string({ required_error: categoryName }).min(1, {
      message: categoryName,
    }),
    statusId: string({ required_error: statusId }).min(1, {
      message: statusId,
    }),
    statusName: string({ required_error: statusName }).min(1, {
      message: statusName,
    }),
  }),
});

export const updateParcelSchema = object({
  params: object({
    id: string({ required_error: id })
      .min(1, { message: id })
      .regex(regexId, { message: id }),
  }),
  body: object({
    code: string({ required_error: code }).min(1, {
      message: code,
    }),
    oldCode: string().optional().nullable(),
    receivedDate: string({ required_error: receivedDate }),
    detail: string({ required_error: detail }).min(1, {
      message: detail,
    }),
    remark: string().optional().nullable(),
    image: string().optional().nullable(),
    categoryId: string({ required_error: categoryId }).min(1, {
      message: categoryId,
    }),
    categoryName: string({ required_error: categoryName }).min(1, {
      message: categoryName,
    }),
    statusId: string({ required_error: statusId }).min(1, {
      message: statusId,
    }),
    statusName: string({ required_error: statusName }).min(1, {
      message: statusName,
    }),
  }),
});

export const updateQuantityParcelSchema = object({
  params: object({
    id: string({ required_error: id })
      .min(1, { message: id })
      .regex(regexId, { message: id }),
  }),
  body: object({
    quantity: number({ required_error: quantity }).min(1, {
      message: quantity,
    }),
  }),
});

export const deleteParcelSchema = object({
  params: object({
    id: string({ required_error: id })
      .min(1, { message: id })
      .regex(regexId, { message: id }),
  }),
});

export type CreateParcelInput = TypeOf<typeof createParcelSchema>['body'];
export type UpdateParcelInput = TypeOf<typeof updateParcelSchema>;
export type UpdateQuantityParcelInput = TypeOf<
  typeof updateQuantityParcelSchema
>;
export type DeleteParcelInput = TypeOf<typeof deleteParcelSchema>['params'];

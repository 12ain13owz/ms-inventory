import { object, string, TypeOf } from 'zod';

const regexNumber = new RegExp(/^[0-9]\d*$/);

const id = 'ไม่พบครุภัณฑ์';
const code = 'ไม่พบรหัสครุภัณฑ์';
const description = 'ไม่พบรายการครุภัณฑ์';
const unit = 'ไม่พบหน่วยนับ';
const value = 'ไม่พบมูลค่าครุภัณฑ์';
const receivedDate = 'ไม่พบวันที่ได้รับมา';
const fundingSource = 'ไม่พบแหล่งเงิน';
const location = 'ไม่พบสถานที่ตั้ง/จัดเก็บ';
const categoryId = 'ไม่พบคุณสมบัติ (ยี่ห้อ/รุ่น)';
const categoryName = 'ไม่พบคุณสมบัติ (ยี่ห้อ/รุ่น)';
const statusId = 'ไม่พบสถานะครุภัณฑ์';
const statusName = 'ไม่พบสถานะครุภัณฑ์';
const usageId = 'ไม่พบการใช้งานครุภัณฑ์';
const usageName = 'ไม่พบการใช้งานครุภัณฑ์';

const dateStart = 'ไม่พบวันที่เริ่มต้นในการค้นหา';
const dateEnd = 'ไม่พบวันที่สิ้นสุดในการค้นหา';
const track = 'ไม่พบเลข Track';
const imageEdit = 'ไม่พบข้อมูล การยืนยันแก้ไขรูปภาพ';

export const inventorySchema = {
  findByDate: object({
    params: object({
      dateStart: string({ required_error: dateStart }).min(1, {
        message: dateStart,
      }),
      dateEnd: string({ required_error: dateEnd }).min(1, {
        message: dateEnd,
      }),
    }),
  }),

  findByTrack: object({
    params: object({
      track: string({ required_error: track }).min(1, { message: track }),
    }),
  }),

  findById: object({
    params: object({
      id: string({ required_error: id })
        .min(1, { message: id })
        .regex(regexNumber, { message: id }),
    }),
  }),

  findByCode: object({
    params: object({
      code: string({ required_error: code }).min(1, { message: code }),
    }),
  }),

  create: object({
    body: object({
      code: string({ required_error: code }).min(1, {
        message: code,
      }),
      oldCode: string().optional().nullable(),
      description: string({ required_error: description }).min(1, {
        message: description,
      }),
      unit: string({ required_error: unit }).min(1, { message: unit }),
      value: string({ required_error: value }),
      receivedDate: string({ required_error: receivedDate }),
      fundingSource: string({ required_error: fundingSource }).min(1, {
        message: fundingSource,
      }),
      location: string({ required_error: location }).min(1, {
        message: location,
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
      usageId: string({ required_error: usageId }).min(1, {
        message: usageId,
      }),
      usageName: string({ required_error: usageName }).min(1, {
        message: usageName,
      }),
    }),
  }),

  update: object({
    params: object({
      id: string({ required_error: id })
        .min(1, { message: id })
        .regex(regexNumber, { message: id }),
    }),
    body: object({
      code: string({ required_error: code }).min(1, {
        message: code,
      }),
      oldCode: string().optional().nullable(),
      description: string({ required_error: description }).min(1, {
        message: description,
      }),
      unit: string({ required_error: unit }).min(1, { message: unit }),
      value: string({ required_error: value }),
      receivedDate: string({ required_error: receivedDate }),
      fundingSource: string({ required_error: fundingSource }).min(1, {
        message: fundingSource,
      }),
      location: string({ required_error: location }).min(1, {
        message: location,
      }),
      remark: string().optional().nullable(),
      image: string().optional().nullable(),
      imageEdit: string({ required_error: imageEdit }).min(1, {
        message: imageEdit,
      }),
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
      usageId: string({ required_error: usageId }).min(1, {
        message: usageId,
      }),
      usageName: string({ required_error: usageName }).min(1, {
        message: usageName,
      }),
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

export type InventoryType = {
  findByDate: TypeOf<typeof inventorySchema.findByDate>['params'];
  findByTrack: TypeOf<typeof inventorySchema.findByTrack>['params'];
  findById: TypeOf<typeof inventorySchema.findById>['params'];
  findByCode: TypeOf<typeof inventorySchema.findByCode>['params'];
  create: TypeOf<typeof inventorySchema.create>['body'];
  update: TypeOf<typeof inventorySchema.update>;
  delete: TypeOf<typeof inventorySchema.delete>['params'];
};

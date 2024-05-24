import { TypeOf, boolean, object, string } from 'zod';

const regexId = new RegExp(/^[0-9]\d*$/);

const id = 'ไม่พบการใช้งานครุภัณฑ์';
const name = 'ไม่พบการใช้งานครุภัณฑ์';
const active = 'ไม่พบสถานะการใช้งาน';

export const usageStatusSchema = {
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

export type UsageStatusType = {
  create: TypeOf<typeof usageStatusSchema.create>['body'];
  update: TypeOf<typeof usageStatusSchema.update>;
  delete: TypeOf<typeof usageStatusSchema.delete>['params'];
};

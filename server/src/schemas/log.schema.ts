import { object, string, TypeOf } from 'zod';

const regexNumber = new RegExp(/^[0-9]\d*$/);

const id = 'ไม่พบครุภัณฑ์';
const dateStart = 'ไม่พบวันที่เริ่มต้นในการค้นหา';
const dateEnd = 'ไม่พบวันที่สิ้นสุดในการค้นหา';
const track = 'ไม่พบเลข Track';
const code = 'ไม่พบรหัสครุภัณฑ์';

export const logSchema = {
  search: object({
    query: object({
      code: string({ required_error: code }),
    }),
  }),

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
      track: string({ required_error: track }).min(1, {
        message: track,
      }),
    }),
  }),

  findByCode: object({
    params: object({
      code: string({ required_error: code }).min(1, {
        message: code,
      }),
    }),
  }),

  findById: object({
    params: object({
      id: string({ required_error: id })
        .min(1, {
          message: id,
        })
        .regex(regexNumber, { message: id }),
    }),
  }),
};

export type LogType = {
  search: TypeOf<typeof logSchema.search>['query'];
  findByDate: TypeOf<typeof logSchema.findByDate>['params'];
  findByTrack: TypeOf<typeof logSchema.findByTrack>['params'];
  findByCode: TypeOf<typeof logSchema.findByCode>['params'];
  findById: TypeOf<typeof logSchema.findById>['params'];
};

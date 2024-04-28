import { object, string, TypeOf } from 'zod';

const id = 'ไม่พบรหัสพัสดุ';
const dateStart = 'ไม่พบวันที่เริ่มต้นในการค้นหา';
const dateEnd = 'ไม่พบวันที่สิ้นสุดในการค้นหา';
const track = 'ไม่พบเลข Track';
const code = 'ไม่พบรหัสพัสดุ';

export const getLogByDateSchema = object({
  params: object({
    dateStart: string({ required_error: dateStart }).min(1, {
      message: dateStart,
    }),
    dateEnd: string({ required_error: dateEnd }).min(1, {
      message: dateEnd,
    }),
  }),
});

export const getLogByTrackSchema = object({
  params: object({
    track: string({ required_error: track }).min(1, {
      message: track,
    }),
  }),
});

export const getLogByCodeSchema = object({
  params: object({
    code: string({ required_error: code }).min(1, {
      message: code,
    }),
  }),
});

export const getLogByIdSchema = object({
  params: object({
    id: string({ required_error: id }).min(1, {
      message: id,
    }),
  }),
});

export type getLogByDateInput = TypeOf<typeof getLogByDateSchema>['params'];
export type getLogByTrackInput = TypeOf<typeof getLogByTrackSchema>['params'];
export type getLogByCodeInput = TypeOf<typeof getLogByCodeSchema>['params'];
export type getLogByIdInput = TypeOf<typeof getLogByIdSchema>['params'];

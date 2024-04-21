import { object, string, TypeOf } from 'zod';

const dateStart = 'ไม่พบวันที่เริ่มต้นในการค้นหา';
const dateEnd = 'ไม่พบวันที่สิ้นสุดในการค้นหา';
const track = 'ไม่พบเลข Track';

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

export type getLogByDateInput = TypeOf<typeof getLogByDateSchema>['params'];
export type getLogByTrackInput = TypeOf<typeof getLogByTrackSchema>['params'];

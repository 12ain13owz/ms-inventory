import { TypeOf, boolean, number, object, string } from 'zod';

const regexNumber = new RegExp(/^[0-9]\d*$/);

const id = 'ไม่พบ ข้อมูลที่ต้องการตรวจสอบ';
const year = 'ไม่พบ ปีที่ต้องการค้นหา';
const inventoryId = 'ไม่พบครุภัณฑ์';

export const inventoryCheckSehema = {
  findByYear: object({
    params: object({
      year: string({ required_error: year })
        .min(1, { message: year })
        .regex(regexNumber, { message: year }),
    }),
  }),

  findById: object({
    params: object({
      id: string({ required_error: id })
        .min(1, { message: id })
        .regex(regexNumber, { message: year }),
    }),
  }),

  create: object({
    body: object({
      inventoryId: number({ required_error: inventoryId }).min(1, {
        message: inventoryId,
      }),
    }),
  }),
};

export type InventoryCheckType = {
  findByYear: TypeOf<typeof inventoryCheckSehema.findByYear>['params'];
  findById: TypeOf<typeof inventoryCheckSehema.findById>['params'];
  create: TypeOf<typeof inventoryCheckSehema.create>['body'];
};

import { TypeOf, object, number } from 'zod';

export const getUserSchema = object({
  params: object({
    id: number().min(1, { message: 'ไม่พบข้อมูลผู้ใช้ในระบบ' }),
  }),
});

export type getUserInput = TypeOf<typeof getUserSchema>['params'];

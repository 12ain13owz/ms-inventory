export interface Log {
  id: number;
  track: string;
  code: string;
  oldCode: string;
  receivedDate: string;
  detail: string;
  quantity: number;
  modifyQuantity: number;
  firstname: string;
  lastname: string;
  categoryName: string;
  statusName: string;
  remark: string;
  image: string;
  printCount: number;
  addParcel: boolean;
  addQuantity: boolean;
  updatedAt: string;
  createdAt: string;
}

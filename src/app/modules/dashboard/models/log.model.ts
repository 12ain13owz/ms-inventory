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
  newParcel: boolean;
  increaseQuantity: boolean;
  decreaseQuantity: boolean;
  print: boolean;
  printCount: number;
  detailLog: string;
  updatedAt: string;
  createdAt: string;
}

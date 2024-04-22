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
  editParcel: boolean;
  increaseQuantity: boolean;
  decreaseQuantity: boolean;
  print: boolean;
  printCount: number;
  detailLog: string;
  createdAt: string;
}

export interface LogTable extends Log {
  no: number;
}

export interface FilterLog {
  parcelStatus: string[];
  categories: string[];
  statuses: string[];
}

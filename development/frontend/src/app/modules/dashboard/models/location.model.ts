export interface Location {
  id?: number;
  name: string;
  active: boolean;
  remark: string;
}

export interface LocationTable extends Location {
  no: number;
}

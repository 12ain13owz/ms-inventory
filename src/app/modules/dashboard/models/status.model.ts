export interface Status {
  id?: number;
  name: string;
  active: boolean;
  remark: string;
}

export interface StatusTable extends Status {
  no: number;
}

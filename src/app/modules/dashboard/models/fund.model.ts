export interface Fund {
  id?: number;
  name: string;
  active: boolean;
  remark: string;
}

export interface FundTable extends Fund {
  no: number;
}

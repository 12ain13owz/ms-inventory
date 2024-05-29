export interface Category {
  id?: number;
  name: string;
  active: boolean;
  remark: string;
}

export interface CategoryTable extends Category {
  no: number;
}

export interface User {
  id?: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  active: boolean;
  remark: string;
}

export interface UserTable extends User {
  no: number;
}

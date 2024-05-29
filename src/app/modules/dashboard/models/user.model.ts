import { Message } from '../../shared/models/response.model';

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

export interface UserResponse extends Message {
  user: User;
}

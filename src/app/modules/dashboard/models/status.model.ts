import { Message } from '../../shared/models/response.model';

export interface Status {
  id?: number;
  name: string;
  active: boolean;
  remark: string;
}

export interface StatusTable extends Status {
  no: number;
}

export interface StatusResponse extends Message {
  status: Status;
}

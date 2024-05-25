import { Message } from '../../shared/models/response.model';

export interface Usage {
  id?: number;
  name: string;
  active: boolean;
  remark: string;
}

export interface UsageTable extends Usage {
  no: number;
}

export interface UsageResponse extends Message {
  usage: Usage;
}

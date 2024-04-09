import { Message } from '../../shared/models/response.model';
import { Log } from './log.model';

export interface Parcel {
  id: number;
  track: string;
  code: string;
  oldCode: string;
  receivedDate: Date;
  detail: string;
  quantity: number;
  print: boolean;
  remark: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  User: { firstname: string; lastname: string };
  Category: { id: number; name: string };
  Status: { id: number; name: string };
}

export interface ParcelTable {
  no: number;
  id: number;
  image: string;
  track: string;
  receivedDate: Date;
  category: string;
  status: string;
  detail: string;
  quantity: number;
}

export interface ParcelResponse extends Message {
  parcel: Parcel;
  log: Log;
}

export interface ParcelQuantity extends Message {
  quantity: number;
  log: Log;
}

export interface FilterList {
  categories: string[];
  statuses: string[];
}

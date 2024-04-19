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

export interface FilterList {
  categories: string[];
  statuses: string[];
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
  print: boolean;
}

export interface ParcelScan {
  id: number;
  image: string;
  track: string;
  quantity: number;
  stock: number;
}

export interface ParcelPrint {
  id: number;
  image: string;
  track: string;
  quantity: number;
  print: boolean;
  printCount: number;
  fileUrl?: string;
}

export interface ParcelPrintPayload {
  printCount: number;
  detailLog: string;
}

export interface ParcelResponse extends Message {
  parcel: Parcel;
  log: Log;
}

export interface ParcelQuantityResponse extends Message {
  id: number;
  quantity: number;
  log: Log;
}

export interface ParcelPrintResponse extends Message {
  id: number;
  print: boolean;
  log: Log;
}

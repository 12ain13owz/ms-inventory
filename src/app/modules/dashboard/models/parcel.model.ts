import { FormControl, FormGroup } from '@angular/forms';
import { Message } from '../../shared/models/response.model';
import { Log } from './log.model';

export interface Parcel {
  id?: number;
  track: string;
  code: string;
  oldCode: string;
  receivedDate: Date;
  detail: string;
  quantity: number;
  print: boolean;
  remark: string;
  image: string;
  UserId?: number;
  CategoryId?: number;
  StatusId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  User?: { firstname: string; lastname: string };
  Category?: { name: string };
  Status?: { name: string };
}

export interface ParcelTable {
  id: number;
  image: string;
  track: string;
  receivedDate: Date;
  category: string;
  status: string;
  detail: string;
  quantity: number;
}

export interface ParcelForm
  extends FormGroup<{
    code: FormControl<string>;
    oldCode: FormControl<string>;
    receivedDate: FormControl<Date>;
    detail: FormControl<string>;
    quantity: FormControl<number>;
    remark: FormControl<string>;
    image: FormControl<File>;
  }> {}

export interface ParcelResponse extends Message {
  parcel: Parcel;
  log: Log;
}

export interface ParcelQuantity extends Message {
  quantity: number;
  log: Log;
}

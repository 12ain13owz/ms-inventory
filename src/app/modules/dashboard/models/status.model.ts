import { FormControl, FormGroup } from '@angular/forms';
import { Message } from '../../shared/models/response.model';

export interface Status {
  id?: number;
  name: string;
  place: string;
  active: boolean;
  remark: string;
}

export interface StatusForm
  extends FormGroup<{
    id: FormControl<number>;
    name: FormControl<string>;
    place: FormControl<string>;
    active: FormControl<boolean>;
    remark: FormControl<string>;
  }> {}

export interface StatusResponse extends Message {
  status: Status;
}

import { FormControl, FormGroup } from '@angular/forms';

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  active?: boolean;
  remark?: string;
}

export interface DecodeUser extends User {
  iat: number;
  exp: number;
}

export interface UserForm
  extends FormGroup<{
    email: FormControl<string>;
    firstname: FormControl<string>;
    lastname: FormControl<string>;
    role: FormControl<string>;
    remark: FormControl<string>;
  }> {}

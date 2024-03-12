import { FormControl, FormGroup } from '@angular/forms';
import { Message } from '../../shared/models/response.model';

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  active: boolean;
  remark: string;
}

export interface UserForm
  extends FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
    firstname: FormControl<string>;
    lastname: FormControl<string>;
    role: FormControl<string>;
    active: FormControl<boolean>;
    remark: FormControl<string>;
  }> {}

export interface UserPassword {
  id: number;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserPasswordForm
  extends FormGroup<{
    id: FormControl<number>;
    oldPassword: FormControl<string>;
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
  }> {}

export interface UserResponse extends Message {
  user: User;
}

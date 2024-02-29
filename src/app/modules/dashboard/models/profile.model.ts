import { FormControl, FormGroup } from '@angular/forms';

export interface Profile {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  active: boolean;
  remark: string;
}

export interface ProfileForm
  extends FormGroup<{
    email: FormControl<string>;
    firstname: FormControl<string>;
    lastname: FormControl<string>;
    role: FormControl<string>;
    remark: FormControl<string>;
  }> {}

export interface Password {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordForm
  extends FormGroup<{
    oldPassword: FormControl<string>;
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
  }> {}

import { FormControl, FormGroup } from '@angular/forms';

export interface LoginRequest {
  email: string;
  password: string;
  receptchaToken: string;
}

export interface LoginForm
  extends FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    receptchaToken: FormControl<string>;
  }> {}

import { FormControl, FormGroup } from '@angular/forms';
import { AccessToken } from '../../shared/models/token.model';
import { Profile } from '../../dashboard/models/profile.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends AccessToken {
  payload: Profile;
}

export interface LoginForm
  extends FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }> {}

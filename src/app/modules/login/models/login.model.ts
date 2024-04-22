import { AccessToken } from '../../shared/models/token.model';
import { Profile } from '../../dashboard/models/profile.model';

export interface LoginRequest {
  email: string;
  password: string;
  recaptcha: string;
}

export interface LoginResponse extends AccessToken {
  payload: Profile;
}

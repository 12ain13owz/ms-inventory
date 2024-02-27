import { Profile } from '../../dashboard/models/profile.model';

export interface AccessToken {
  accessToken: string;
}

export interface LoginRespones extends AccessToken {
  payload: Profile;
}

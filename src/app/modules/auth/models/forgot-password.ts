import { Message } from '../../shared/models/response.model';

export interface ForgetPasswordResult extends Message {
  id: number;
}

export interface ResetPasswordPayload {
  passwordResetCode: string;
  newPassword: string;
  confirmPassword: string;
}

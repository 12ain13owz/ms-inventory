export interface Profile {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  active: boolean;
  remark: string;
}

export interface Password {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

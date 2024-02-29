import { compareSync, genSaltSync, hashSync } from 'bcrypt';
const salt = genSaltSync(10);

export function hashPassword(password: string): string {
  return hashSync(password, salt);
}

export function comparePassword(
  password: string,
  confirmPassword: string
): boolean {
  return compareSync(password, confirmPassword);
}

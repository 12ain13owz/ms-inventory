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

export function newError(
  status: number,
  message: string,
  logout?: boolean
): Error & {
  status: number;
  logout: boolean | undefined;
} {
  return Object.assign(new Error(message), { status, logout });
}

// ลบช่องว่าง
export function removeWhitespace(value: string): string {
  return value.replace(/^\s+|\s+$/gm, '');
}

export function normalizeUnique(value: string): string {
  return removeWhitespace(value).toLowerCase();
}

export const privateFields = ['createdAt', 'updatedAt'];

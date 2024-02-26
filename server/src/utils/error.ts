export function newError(status: number, message: string, logout?: boolean) {
  return Object.assign(new Error(message), { status, logout });
}

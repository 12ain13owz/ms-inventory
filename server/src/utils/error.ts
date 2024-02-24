export function newError(status: number, message: string) {
  return Object.assign(new Error(message), { status });
}

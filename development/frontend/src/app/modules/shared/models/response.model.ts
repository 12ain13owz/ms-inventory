export interface Message {
  message: string;
}

export interface ApiResponse<T = any> {
  message?: string;
  item?: T;
}

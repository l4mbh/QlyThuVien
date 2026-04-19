export interface ApiResponse<T = any> {
  data?: T;
  code: number;
  error?: {
    msg: string;
  };
}

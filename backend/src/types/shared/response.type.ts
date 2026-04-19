import { ErrorCode } from "../../constants/errors/error.enum";

export interface ApiResponse<T = any> {
  data?: T;
  code: number | ErrorCode;
  error?: {
    msg: string;
  };
}

import { HttpStatus } from "@nestjs/common";

export interface ResponseDto<T = any> {
  successful: boolean;
  statusCode: HttpStatus;
  message: string;
  timestamp: string;
  data?: T;
  errors?: Array<any>;
}
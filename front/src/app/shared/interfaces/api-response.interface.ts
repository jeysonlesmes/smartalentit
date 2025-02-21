export interface ApiResponse<T> {
  successful: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  data?: T;
  errors?: Array<any>;
}
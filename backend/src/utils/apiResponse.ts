import { HttpStatusCode } from '../constants/httpStatus';

class ApiResponse<T = any> {
  public statusCode: HttpStatusCode;
  public success: boolean;
  public message: string;
  public data: T | null;

  constructor(
    statusCode: HttpStatusCode,
    message: string,
    data: T | null = null
  ) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return new ApiResponse(200, message, data);
  }

  static created<T>(data: T, message: string = 'Created successfully'): ApiResponse<T> {
    return new ApiResponse(201, message, data);
  }

  static noContent(message: string = 'Deleted successfully'): ApiResponse<null> {
    return new ApiResponse(204, message, null);
  }
}

export default ApiResponse;

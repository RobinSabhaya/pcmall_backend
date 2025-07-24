export interface IApiError {
  statusCode: number;
  message: string;
  isOperational: boolean;
  stack: string;
}
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
    public stack = '',
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;

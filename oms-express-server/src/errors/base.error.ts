export class BaseError extends Error {
  message: string;
  statusCode: number;
  payload?: Array<object>;

  constructor(message: string, statusCode: number, payload?: Array<object>) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.payload = payload;
  }
}

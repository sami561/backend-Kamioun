import { BaseError } from './base.error';

export class ValidationError extends BaseError {
  constructor(message: string, payload?: Array<object>) {
    super(message, 422, payload);
  }
}

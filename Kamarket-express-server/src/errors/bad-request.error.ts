import { BaseError } from './base.error';

export class BadRequestError extends BaseError {
  constructor(message?: string) {
    super(message || 'Bad Request!', 400);
  }
}

import { BaseError } from './base.error';

export class ForbiddenError extends BaseError {
  constructor() {
    super('Forbidden!', 403);
  }
}

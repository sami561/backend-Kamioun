import { BaseError } from './base.error';

export class InternalError extends BaseError {
  constructor() {
    super('Internal Error!', 500);
  }
}

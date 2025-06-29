import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../errors/base.error';
import { InternalError } from '../errors/internal.error';
import { logger } from '../utils/logger';
import { getEnv } from '../utils/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (getEnv('APP_ENV').startsWith('dev')) console.error(err.stack);

  logger.error(err);
  // console.log(err);

  const error = err instanceof BaseError ? err : new InternalError();

  res.status(error.statusCode).json({
    message: error.message,
    validation: error.payload,
  });
};

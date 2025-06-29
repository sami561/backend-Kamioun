import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { ValidationError } from '../errors/validation.error';
import { InternalError } from '../errors/internal.error';

const validationMiddleware = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError('Validation Error!', error.issues);
      }

      throw new InternalError();
    }
  };
};

export default validationMiddleware;

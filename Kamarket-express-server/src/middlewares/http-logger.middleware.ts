import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

const httpLogger = (req: Request, _res: Response, next: NextFunction) => {
  logger.info({ method: req.method, url: req.url }, 'Incoming request');
  next();
};

export default httpLogger;

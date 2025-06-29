import { Request, Response, NextFunction } from 'express';
import apiKeys, { ApiKey } from '../utils/apiKeys';

export interface AuthenticatedRequest extends Request {
  client?: string;
}

export const authenticateApiKey = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.header('X-API-Key');
  const validKey: ApiKey | undefined = apiKeys.find(
    (keyObj: ApiKey) => keyObj.key === apiKey
  );

  if (!validKey) {
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }

  req.client = validKey.client;
  next();
};

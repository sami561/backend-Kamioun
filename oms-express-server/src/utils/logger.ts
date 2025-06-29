import pino from 'pino';
import { getEnv } from '../utils/env';

const getLoggerLevel = (appEnv: string): string => {
  switch (appEnv) {
    case 'production':
      return 'info';
    case 'test':
      return 'silent';
    default:
      return 'debug';
  }
};

export const logger = pino({
  level: getLoggerLevel(getEnv('APP_ENV')),
});

interface Config {
  SERVICE_NAME: string;
  PORT: number;
  DEFAULT_TIMEOUT: number;
  AUTH_JWT_SECRET: string;
  GATEWAY_JWT_SECRET: string;
  GATEWAY_JWT_EXPIRES_IN: string;
  LOG_LEVEL: string;
  REDIS_URL: string;
  OMS_SERVICE_URL: string;
  KAMARKET_SERVICE_URL: string;
}

export const config: Config = {
  SERVICE_NAME: require('../../package.json').name,
  PORT: Number(process.env.PORT) || 3000,
  DEFAULT_TIMEOUT: Number(process.env.DEFAULT_TIMEOUT || '30000'),
  AUTH_JWT_SECRET:
    process.env.AUTH_JWT_SECRET || 'your-default-auth-secret-key',
  GATEWAY_JWT_SECRET:
    process.env.GATEWAY_JWT_SECRET || 'your-default-gateway-secret-key',
  GATEWAY_JWT_EXPIRES_IN: process.env.GATEWAY_JWT_EXPIRES_IN || '1m',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  OMS_SERVICE_URL: process.env.OMS_SERVICE_URL || 'http://34.173.189.86/oms/oms',
  KAMARKET_SERVICE_URL:
    process.env.KAMARKET_SERVICE_URL ||
    'http://34.173.189.86/kamarket/kamarket',
};

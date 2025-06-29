import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  APP_ENV: z.string().default('development'),
  APP_PORT: z
    .string()
    .default('3000')
    .transform((value) => parseInt(value, 10)),
  DB_URL: z.string().url(),
  TEST_DB_URL: z
    .string()
    .url()
    .default('mongodb://root:example@mongo:27017/mydatabase'),
  JWT_SECRET: z.string(),
  API_KEY_1: z.string(),
  API_KEY_2: z.string(),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error(
    'Invalid or missing environment variables:',
    envVars.error.format()
  );
  process.exit(1);
}

export const getEnv = <T extends keyof typeof envVars.data>(
  key: T
): (typeof envVars.data)[T] => {
  return envVars.data[key];
};

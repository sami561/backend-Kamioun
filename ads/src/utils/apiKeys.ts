import { getEnv } from './env';

export interface ApiKey {
  key: string;
  client: string;
}

const apiKeys: ApiKey[] = [
  { key: getEnv('API_KEY_1'), client: 'KamiounApp' },
  { key: getEnv('API_KEY_2'), client: 'OmsPlatform' },
];
export default apiKeys;

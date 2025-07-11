import mongoose, { Mongoose } from 'mongoose';
import { getEnv } from '../utils/env';

export const testDbConnect = async () => {
  const baseUrl = getEnv('TEST_DB_URL');
  const dbName = `testdb-${Date.now()}`;
  const connectionString = `${baseUrl}/${dbName}`;
  return await mongoose.connect(connectionString);
};
export const testDbCleanup = async (db: Mongoose) => {
  const databases = await db.connection.db?.admin().listDatabases();
  if (!databases) return;
  databases.databases.forEach(async (database) => {
    if (database.name.startsWith('DBurl-')) {
      await db.connection.getClient().db(database.name).dropDatabase();
    }
  });
  await db.connection.close();
};

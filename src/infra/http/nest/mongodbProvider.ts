import * as mongoose from 'mongoose';
import { config } from 'dotenv';
export const databaseProviders = {
  provide: 'DATABASE_CONNECTION',
  useFactory: (): Promise<typeof mongoose> => {
    config();
    return mongoose.connect(process.env.connectionString);
  },
};
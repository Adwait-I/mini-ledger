import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: Number(process.env.PORT) || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:1977@localhost:5432/miniledger?schema=public',
  jwtSecret: process.env.JWT_SECRET || 'miniledger_jwt_super_secret_key_1977_token',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

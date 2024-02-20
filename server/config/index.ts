require('dotenv').config();
import { Dialect } from 'sequelize';

interface DatabaseConfig {
  dialect: Dialect;
  storage: string;
}

interface AppConfig {
  port: number;
  database: DatabaseConfig;
  accessTokenPrivateKey: string;
  accessTokenPublicKey: string;
  refrestTokenPrivateKey: string;
  refreshTokenPublicKey: string;
}

const config: AppConfig = {
  port: Number(process.env.PORT) || 3500,
  database: {
    dialect: 'sqlite',
    storage: './database/ms_stock.sqlite',
  },
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY || '',
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY || '',
  refrestTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY || '',
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY || '',
};

export default config;

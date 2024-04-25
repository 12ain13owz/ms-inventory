require('dotenv').config();
import { Dialect } from 'sequelize';

interface DatabaseConfig {
  dialect: Dialect;
  storage: string;
}

interface AppConfig {
  port: number;
  node_env: string;
  database: DatabaseConfig;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    service: string;
    user: string;
    pass: string;
  };
  recaptcha: {
    siteKey: string;
    secretKey: string;
  };
  accessTokenPrivateKey: string;
  accessTokenPublicKey: string;
  refreshTokenPrivateKey: string;
  refreshTokenPublicKey: string;
}

const config: AppConfig = {
  port: Number(process.env.PORT) || 3000,
  node_env: process.env.NODE_ENV || 'development',
  database: {
    dialect: 'sqlite',
    storage: './database/ms_stock.sqlite',
  },
  smtp: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    user: process.env.USER_MAIL || '',
    pass: process.env.PASS_MAIL || '',
  },
  recaptcha: {
    siteKey: process.env.RECAPTCHA_SITE_KEY || '',
    secretKey: process.env.RECAPTCHA_SECRET_KEY || '',
  },
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY || '',
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY || '',
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY || '',
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY || '',
};

export default config;

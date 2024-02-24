require('dotenv').config();

import { Dialect } from 'sequelize';

interface DatabaseConfig {
  dialect: Dialect;
  storage: string;
}

interface AppConfig {
  port: number;
  // recaptcha: { siteKey: string };
  // recaptchaUrl: string;
  database: DatabaseConfig;
  accessTokenPrivateKey: string;
  accessTokenPublicKey: string;
  refreshTokenPrivateKey: string;
  refreshTokenPublicKey: string;
}

const config: AppConfig = {
  port: Number(process.env.PORT) || 3000,
  // recaptcha: { siteKey: process.env.SITEKEY || '' },
  // recaptchaUrl: 'https://www.google.com/recaptcha/api/siteverify',
  database: {
    dialect: 'sqlite',
    storage: './database/ms_stock.sqlite',
  },
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY || '',
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY || '',
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY || '',
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY || '',
};

export default config;

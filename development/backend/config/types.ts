import { Dialect } from "sequelize";

export interface AppConfig {
  port: number;
  node_env: string;
  database: {
    dialect: Dialect;
    storage: string;
  };
  mailer: {
    host: string;
    port: number;
    secure: boolean;
    service?: string;
    user: string;
    pass: string;
  };
  whiteList: string;
  recaptcha: {
    siteKey: string;
    secretKey: string;
  };
  accessTokenPrivateKey: string;
  accessTokenPublicKey: string;
  refreshTokenPrivateKey: string;
  refreshTokenPublicKey: string;
}

export type ConfigKey = keyof AppConfig;

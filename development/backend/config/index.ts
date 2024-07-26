import { AppConfig, ConfigKey } from "./types";
import { developmentConfig } from "./development";
import { productionConfig } from "./production";

class Config {
  private config: AppConfig;

  constructor() {
    this.config =
      process.env.NODE_ENV === "production"
        ? productionConfig
        : developmentConfig;
  }

  get<K extends ConfigKey>(key: K): AppConfig[K] {
    return this.config[key];
  }
}

export const config = new Config();

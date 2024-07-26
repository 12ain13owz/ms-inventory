"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const development_1 = require("./development");
const production_1 = require("./production");
class Config {
    constructor() {
        this.config =
            process.env.NODE_ENV === "production"
                ? production_1.productionConfig
                : development_1.developmentConfig;
    }
    get(key) {
        return this.config[key];
    }
}
exports.config = new Config();

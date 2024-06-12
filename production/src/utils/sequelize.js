"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    dialect: config_1.default.get('database.dialect'),
    storage: config_1.default.get('database.storage'),
});
exports.default = sequelize;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    dialect: config_1.config.get("database").dialect,
    storage: config_1.config.get("database").storage,
});
exports.default = sequelize;

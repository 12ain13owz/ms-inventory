"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logService = void 0;
const sequelize_1 = require("sequelize");
const log_model_1 = __importDefault(require("../models/log.model"));
exports.logService = {
    searchByCode(code) {
        return log_model_1.default.findAll({
            where: { code: { [sequelize_1.Op.like]: `${code}%` } },
        });
    },
    findAll() {
        return log_model_1.default.findAll();
    },
    findLimit(limit) {
        return log_model_1.default.findAll({ limit: limit, order: [['createdAt', 'DESC']] });
    },
    findByDate(dateStart, dateEnd) {
        return log_model_1.default.findAll({
            where: { createdAt: { [sequelize_1.Op.between]: [dateStart, dateEnd] } },
        });
    },
    findByCode(code) {
        return log_model_1.default.findAll({ where: { code } });
    },
    findByTrack(track) {
        return log_model_1.default.findAll({ where: { track } });
    },
    findById(id) {
        return log_model_1.default.findByPk(id);
    },
    create(log, t) {
        return log_model_1.default.create(log.toJSON(), { transaction: t });
    },
};

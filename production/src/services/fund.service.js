"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fundService = void 0;
const sequelize_1 = require("sequelize");
const fund_model_1 = __importDefault(require("../models/fund.model"));
exports.fundService = {
    findAll() {
        return fund_model_1.default.findAll(Object.assign({}, queryOptions()));
    },
    findById(id) {
        return fund_model_1.default.findByPk(id, Object.assign({}, queryOptions()));
    },
    findByName(name) {
        return fund_model_1.default.findOne(Object.assign({ where: { name: { [sequelize_1.Op.like]: name } } }, queryOptions()));
    },
    create(fund) {
        return fund_model_1.default.create(fund.toJSON());
    },
    update(id, fund) {
        return fund_model_1.default.update(fund, { where: { id } });
    },
    delete(id) {
        return fund_model_1.default.destroy({ where: { id } });
    },
};
function queryOptions() {
    return { attributes: { exclude: ['createdAt', 'updatedAt'] } };
}

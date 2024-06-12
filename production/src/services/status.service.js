"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusService = void 0;
const sequelize_1 = require("sequelize");
const status_model_1 = __importDefault(require("../models/status.model"));
exports.statusService = {
    findAll() {
        return status_model_1.default.findAll(Object.assign({}, queryOptions()));
    },
    findById(id) {
        return status_model_1.default.findByPk(id, Object.assign({}, queryOptions()));
    },
    findByName(name) {
        return status_model_1.default.findOne(Object.assign({ where: { name: { [sequelize_1.Op.like]: name } } }, queryOptions()));
    },
    create(status) {
        return status_model_1.default.create(status.toJSON());
    },
    update(id, status) {
        return status_model_1.default.update(status, { where: { id } });
    },
    delete(id) {
        return status_model_1.default.destroy({ where: { id } });
    },
};
function queryOptions() {
    return { attributes: { exclude: ['createdAt', 'updatedAt'] } };
}

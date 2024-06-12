"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationService = void 0;
const sequelize_1 = require("sequelize");
const location_model_1 = __importDefault(require("../models/location.model"));
exports.locationService = {
    findAll() {
        return location_model_1.default.findAll(Object.assign({}, queryOptions()));
    },
    findById(id) {
        return location_model_1.default.findByPk(id, Object.assign({}, queryOptions()));
    },
    findByName(name) {
        return location_model_1.default.findOne(Object.assign({ where: { name: { [sequelize_1.Op.like]: name } } }, queryOptions()));
    },
    create(location) {
        return location_model_1.default.create(location.toJSON());
    },
    update(id, location) {
        return location_model_1.default.update(location, { where: { id } });
    },
    delete(id) {
        return location_model_1.default.destroy({ where: { id } });
    },
};
function queryOptions() {
    return { attributes: { exclude: ['createdAt', 'updatedAt'] } };
}

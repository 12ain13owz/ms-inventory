"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const sequelize_1 = require("sequelize");
const category_model_1 = __importDefault(require("../models/category.model"));
exports.categoryService = {
    findAll() {
        return category_model_1.default.findAll(Object.assign({}, queryOptions()));
    },
    findById(id) {
        return category_model_1.default.findByPk(id, Object.assign({}, queryOptions()));
    },
    findByName(name) {
        return category_model_1.default.findOne(Object.assign({ where: { name: { [sequelize_1.Op.like]: name } } }, queryOptions()));
    },
    create(category) {
        return category_model_1.default.create(category.toJSON());
    },
    update(id, category) {
        return category_model_1.default.update(category, { where: { id } });
    },
    delete(id) {
        return category_model_1.default.destroy({ where: { id } });
    },
};
function queryOptions() {
    return { attributes: { exclude: ['createdAt', 'updatedAt'] } };
}

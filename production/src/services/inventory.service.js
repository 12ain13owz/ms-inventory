"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryService = void 0;
const sequelize_1 = require("sequelize");
const inventory_model_1 = __importDefault(require("../models/inventory.model"));
const user_model_1 = require("../models/user.model");
const category_model_1 = require("../models/category.model");
const status_model_1 = require("../models/status.model");
const fund_model_1 = require("../models/fund.model");
const location_model_1 = require("../models/location.model");
exports.inventoryService = {
    search(code) {
        return inventory_model_1.default.findAll({
            where: { code: { [sequelize_1.Op.like]: `%${code}%` } },
            attributes: ['code'],
        });
    },
    searchByCode(code) {
        return inventory_model_1.default.findAll(Object.assign({ where: { code: { [sequelize_1.Op.like]: `${code}%` } } }, queryOptions()));
    },
    findAll() {
        return inventory_model_1.default.findAll(Object.assign({}, queryOptions()));
    },
    findLimit(limit) {
        return inventory_model_1.default.findAll(Object.assign({ limit: limit, order: [['createdAt', 'DESC']] }, queryOptions()));
    },
    findById(id) {
        return inventory_model_1.default.findByPk(id, Object.assign({}, queryOptions()));
    },
    findByIdDetails(id) {
        return inventory_model_1.default.findByPk(id, {
            include: [
                { model: user_model_1.User, attributes: ['firstname', 'lastname'] },
                { model: category_model_1.Category, attributes: ['id', 'name'] },
                { model: status_model_1.Status, attributes: ['id', 'name'] },
                { model: fund_model_1.Fund, attributes: ['id', 'name'] },
                { model: location_model_1.Location, attributes: ['id', 'name'] },
            ],
        });
    },
    findByTrack(track) {
        return inventory_model_1.default.findOne(Object.assign({ where: { track } }, queryOptions()));
    },
    findByCode(code) {
        return inventory_model_1.default.findOne(Object.assign({ where: { code } }, queryOptions()));
    },
    findByDate(dateStart, dateEnd) {
        return inventory_model_1.default.findAll(Object.assign({ where: { receivedDate: { [sequelize_1.Op.between]: [dateStart, dateEnd] } } }, queryOptions()));
    },
    create(inventory, t) {
        return inventory_model_1.default.create(inventory.toJSON(), {
            transaction: t,
        });
    },
    update(id, inventory, t) {
        return inventory_model_1.default.update(inventory, {
            where: { id },
            transaction: t,
        });
    },
    delete(id) {
        return inventory_model_1.default.destroy({ where: { id } });
    },
};
function queryOptions() {
    return {
        attributes: {
            exclude: ['userId', 'categoryId', 'statusId', 'fundId', 'locationId'],
        },
        include: [
            { model: user_model_1.User, attributes: ['firstname', 'lastname'] },
            { model: category_model_1.Category, attributes: ['id', 'name'] },
            { model: status_model_1.Status, attributes: ['id', 'name'] },
            { model: fund_model_1.Fund, attributes: ['id', 'name'] },
            { model: location_model_1.Location, attributes: ['id', 'name'] },
        ],
    };
}

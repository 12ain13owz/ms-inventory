"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryCheckService = void 0;
const inventory_check_model_1 = __importDefault(require("../models/inventory-check.model"));
const inventory_model_1 = require("../models/inventory.model");
const user_model_1 = require("../models/user.model");
const category_model_1 = require("../models/category.model");
const status_model_1 = require("../models/status.model");
const fund_model_1 = require("../models/fund.model");
const location_model_1 = require("../models/location.model");
exports.inventoryCheckService = {
    findAll() {
        return inventory_check_model_1.default.findAll(Object.assign({}, queryOptions()));
    },
    findByYear(year) {
        return inventory_check_model_1.default.findAll(Object.assign({ where: { year: year } }, queryOptions()));
    },
    findById(id) {
        return inventory_check_model_1.default.findByPk(id, Object.assign({}, queryOptions()));
    },
    findByInventoryId(id, year) {
        return inventory_check_model_1.default.findOne(Object.assign({ where: {
                inventoryId: id,
                year: year,
            } }, queryOptions()));
    },
    create(inventoryCheck, t) {
        return inventory_check_model_1.default.create(inventoryCheck.toJSON(), {
            transaction: t,
        });
    },
    delete(id) {
        return inventory_check_model_1.default.destroy({ where: { id } });
    },
};
function queryOptions() {
    return {
        attributes: {
            exclude: ['inventoryId', 'createdAt'],
        },
        include: [
            {
                model: inventory_model_1.Inventory,
                attributes: {
                    exclude: ['userId', 'categoryId', 'statusId', 'fundId', 'locationId'],
                },
                include: [
                    { model: user_model_1.User, attributes: ['firstname', 'lastname'] },
                    { model: category_model_1.Category, attributes: ['name'] },
                    { model: status_model_1.Status, attributes: ['name'] },
                    { model: fund_model_1.Fund, attributes: ['name'] },
                    { model: location_model_1.Location, attributes: ['name'] },
                ],
            },
        ],
    };
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryCheck = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../utils/sequelize"));
const inventory_model_1 = require("./inventory.model");
class InventoryCheck extends sequelize_1.Model {
}
exports.InventoryCheck = InventoryCheck;
exports.default = InventoryCheck.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    year: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    inventoryId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: inventory_model_1.Inventory, key: 'id' },
    },
}, {
    indexes: [{ fields: ['createdAt'] }, { fields: ['inventoryId'] }],
    sequelize: sequelize_2.default,
    modelName: 'InventoryCheck',
    timestamps: false,
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../utils/sequelize"));
class Log extends sequelize_1.Model {
}
exports.Log = Log;
exports.default = Log.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    track: { type: sequelize_1.DataTypes.STRING(7), allowNull: false },
    code: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    oldCode: { type: sequelize_1.DataTypes.STRING },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    unit: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    value: { type: sequelize_1.DataTypes.FLOAT, allowNull: false },
    receivedDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
    remark: { type: sequelize_1.DataTypes.TEXT },
    image: { type: sequelize_1.DataTypes.TEXT },
    isCreated: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
    firstname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    lastname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    categoryName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    statusName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    fundName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    locationName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    indexes: [
        { fields: ["track"] },
        { fields: ["code"] },
        { fields: ["createdAt"] },
    ],
    sequelize: sequelize_2.default,
    modelName: "Log",
    timestamps: false,
});

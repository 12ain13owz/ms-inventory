"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateUserFields = exports.User = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../utils/sequelize"));
class User extends sequelize_1.Model {
}
exports.User = User;
exports.default = User.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: { isEmail: { msg: 'รูปแบบ E-mail ไม่ถูกต้อง' } },
    },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    firstname: { type: sequelize_1.DataTypes.STRING(50), allowNull: false },
    lastname: { type: sequelize_1.DataTypes.STRING(50), allowNull: false },
    role: { type: sequelize_1.DataTypes.ENUM('admin', 'user'), allowNull: false },
    active: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
    remark: { type: sequelize_1.DataTypes.TEXT },
    passwordResetCode: { type: sequelize_1.DataTypes.STRING },
    passwordExpired: { type: sequelize_1.DataTypes.DATE },
    createdAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    updatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
}, {
    indexes: [{ fields: ['email'] }],
    sequelize: sequelize_2.default,
    modelName: 'User',
    timestamps: true,
});
exports.privateUserFields = [
    'password',
    'passwordResetCode',
    'passwordExpired',
    'createdAt',
    'updatedAt',
];

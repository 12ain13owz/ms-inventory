"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
exports.userService = {
    findAll() {
        return user_model_1.default.findAll(Object.assign({}, queryOptions()));
    },
    findById(id) {
        return user_model_1.default.findByPk(id);
    },
    findByEmail(email) {
        return user_model_1.default.findOne({ where: { email } });
    },
    create(user) {
        return user_model_1.default.create(user.toJSON());
    },
    update(id, user) {
        return user_model_1.default.update(user, { where: { id } });
    },
    changePassword(id, password) {
        return user_model_1.default.update({ password }, { where: { id } });
    },
    resetPassword(id, password) {
        return user_model_1.default.update({ password: password, passwordResetCode: null, passwordExpired: null }, { where: { id } });
    },
};
function queryOptions() {
    return {
        attributes: {
            exclude: [
                'password',
                'passwordResetCode',
                'passwordExpired',
                'createdAt',
                'updatedAt',
            ],
        },
    };
}

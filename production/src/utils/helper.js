"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateFields = exports.normalizeUnique = exports.removeWhitespace = exports.comparePassword = exports.hashPassword = exports.newError = void 0;
const bcrypt_1 = require("bcrypt");
const salt = (0, bcrypt_1.genSaltSync)(10);
function newError(status, message, logout) {
    return Object.assign(new Error(message), { status, logout });
}
exports.newError = newError;
function hashPassword(password) {
    return (0, bcrypt_1.hashSync)(password, salt);
}
exports.hashPassword = hashPassword;
function comparePassword(password, confirmPassword) {
    return (0, bcrypt_1.compareSync)(password, confirmPassword);
}
exports.comparePassword = comparePassword;
function removeWhitespace(value) {
    return value.replace(/^\s+|\s+$/gm, '');
}
exports.removeWhitespace = removeWhitespace;
function normalizeUnique(value) {
    return removeWhitespace(value).toLowerCase();
}
exports.normalizeUnique = normalizeUnique;
exports.privateFields = ['createdAt', 'updatedAt'];

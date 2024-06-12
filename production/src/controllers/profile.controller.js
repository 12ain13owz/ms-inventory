"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordController = exports.updateProfileController = exports.findProfileController = void 0;
const user_service_1 = require("../services/user.service");
const helper_1 = require("../utils/helper");
const lodash_1 = require("lodash");
const user_model_1 = require("../models/user.model");
function findProfileController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'findProfileController';
        try {
            const resProfile = (0, lodash_1.omit)(res.locals.user, user_model_1.privateUserFields);
            res.json(resProfile);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.findProfileController = findProfileController;
function updateProfileController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'updateProfileController';
        try {
            const email = (0, helper_1.normalizeUnique)(req.body.email);
            const user = yield user_service_1.userService.findByEmail(email);
            if (user && user.id !== res.locals.userId)
                throw (0, helper_1.newError)(400, `แก้ไข E-mail ไม่สำเร็จเนื่องจาก ${email} นี้มีอยู่ในระบบ`);
            const payload = {
                email: email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                remark: req.body.remark || '',
            };
            const [result] = yield user_service_1.userService.update(res.locals.userId, payload);
            if (!result)
                throw (0, helper_1.newError)(400, 'แก้ไขโปรไฟล์ไม่สำเร็จ');
            res.json({ message: 'แก้ไขโปรไฟล์สำเร็จ' });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateProfileController = updateProfileController;
function changePasswordController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'changePasswordController';
        try {
            const compare = (0, helper_1.comparePassword)(req.body.oldPassword, res.locals.user.password);
            if (!compare)
                throw (0, helper_1.newError)(400, 'รหัสผ่านเก่าไม่ถูกต้อง');
            const hash = (0, helper_1.hashPassword)(req.body.newPassword);
            const [result] = yield user_service_1.userService.changePassword(res.locals.userId, hash);
            if (!result)
                throw (0, helper_1.newError)(400, 'แก้ไขรหัสผ่านไม่สำเร็จ');
            res.json({ message: 'แก้ไขรหัสผ่านสำเร็จ' });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.changePasswordController = changePasswordController;

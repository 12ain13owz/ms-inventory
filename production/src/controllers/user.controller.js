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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordController = exports.forgotPassworController = exports.updateUserController = exports.createUserController = exports.findAllUserController = void 0;
const config_1 = __importDefault(require("config"));
const lodash_1 = require("lodash");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const helper_1 = require("../utils/helper");
const user_service_1 = require("../services/user.service");
const user_model_1 = require("../models/user.model");
const uuid_1 = require("uuid");
const mailer_1 = require("../utils/mailer");
function findAllUserController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'findAllUserController';
        try {
            const resUsers = yield user_service_1.userService.findAll();
            res.json(resUsers);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.findAllUserController = findAllUserController;
function createUserController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'createUserController';
        try {
            const email = (0, helper_1.normalizeUnique)(req.body.email);
            const user = yield user_service_1.userService.findByEmail(email);
            if (user)
                throw (0, helper_1.newError)(400, `E-mail: ${email} นี้มีอยู่ในระบบ`);
            const password = (0, helper_1.hashPassword)(req.body.password);
            const role = req.body.role;
            const payload = new user_model_1.User({
                email: email,
                password: password,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                role: role,
                active: req.body.active,
                remark: req.body.remark || '',
            });
            const result = yield user_service_1.userService.create(payload);
            const newUser = (0, lodash_1.omit)(result.toJSON(), user_model_1.privateUserFields);
            res.json({
                message: `เพิ่มผู้ใช้งาน ${email} สำเร็จ`,
                item: newUser,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.createUserController = createUserController;
function updateUserController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'updateUserController';
        try {
            const id = +req.params.id;
            const email = (0, helper_1.normalizeUnique)(req.body.email);
            const existingUser = yield user_service_1.userService.findByEmail(email);
            if (existingUser && existingUser.id !== id)
                throw (0, helper_1.newError)(400, `แก้ไข E-mail ไม่สำเร็จเนื่องจาก ${email} นี้มีอยู่ในระบบ`);
            const role = req.body.role;
            const payload = {
                email: email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                role: role,
                active: req.body.active,
                remark: req.body.remark || '',
            };
            const [result] = yield user_service_1.userService.update(id, payload);
            if (!result)
                throw (0, helper_1.newError)(400, `แก้ไขข้อมูลผู้ใช้งาน ${email} ไม่สำเร็จ`);
            res.json({
                message: `แก้ไขข้อมูลผู้ใช้งาน ${email} สำเร็จ`,
                item: payload,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateUserController = updateUserController;
function forgotPassworController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'forgotPassworController';
        try {
            const email = (0, helper_1.normalizeUnique)(req.body.email);
            const user = yield user_service_1.userService.findByEmail(email);
            if (!user)
                throw (0, helper_1.newError)(404, 'ไม่พบ E-mail');
            const createdAt = new Date();
            const passwordResetCode = (0, uuid_1.v4)().substring(0, 8);
            const from = config_1.default.get('smtp.user');
            user.passwordResetCode = passwordResetCode;
            user.passwordExpired = new Date(createdAt.getTime() + 1000 * 60 * 60 * 1);
            const pathTemplate = path_1.default.join(__dirname, '../templates/email-template.html');
            const emailTemplate = (0, fs_1.readFileSync)(pathTemplate, 'utf8');
            const html = emailTemplate.replace('{{ passwordResetCode }}', passwordResetCode);
            const payload = {
                from: from,
                to: email,
                subject: 'ระบบคลังพัสดุ เปลี่ยนรหัสผ่าน',
                html: html,
            };
            yield user.save();
            const result = yield (0, mailer_1.sendEmail)(payload);
            if (!result)
                throw (0, helper_1.newError)(503, `ส่งรหัสยืนยัน E-mail: ${email} ไม่สำเร็จ`);
            res.json({ message: `ส่งรหัสยืนยัน E-mail: ${email} สำเร็จ`, id: user.id });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.forgotPassworController = forgotPassworController;
function resetPasswordController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'resetPasswordController';
        try {
            const id = +req.params.id;
            const passwordResetCode = req.body.passwordResetCode;
            const user = yield user_service_1.userService.findById(id);
            if (!user)
                throw (0, helper_1.newError)(404, 'ไม่พบข้อมูลผู้ใช้งานในระบบ');
            if (!user.passwordResetCode)
                throw (0, helper_1.newError)(400, 'ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาส่ง E-mail เพื่อขอเปลี่ยนรหัส');
            if (user.passwordResetCode !== passwordResetCode)
                throw (0, helper_1.newError)(404, 'รหัสยืนยันไม่ถูกต้อง กรุณาตรวจสอบ');
            const createdAt = new Date().getTime();
            const passwordExpired = user.passwordExpired.getTime();
            if (createdAt > passwordExpired) {
                user.passwordResetCode = null;
                user.passwordExpired = null;
                yield user.save();
                throw (0, helper_1.newError)(400, 'รหัสยืนยันหมดอายุ');
            }
            const hash = (0, helper_1.hashPassword)(req.body.newPassword);
            const [result] = yield user_service_1.userService.resetPassword(id, hash);
            if (!result)
                throw (0, helper_1.newError)(400, 'เปลี่ยนรหัสผ่านไม่สำเร็จ');
            res.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.resetPasswordController = resetPasswordController;

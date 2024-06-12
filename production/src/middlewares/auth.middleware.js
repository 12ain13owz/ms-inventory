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
exports.isRoleAdmin = exports.isUserActive = exports.verifyToken = exports.verifyRecaptcha = void 0;
const config_1 = __importDefault(require("config"));
const helper_1 = require("../utils/helper");
const jwt_1 = require("../utils/jwt");
const user_service_1 = require("../services/user.service");
function verifyRecaptcha(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'verifyRecaptcha';
        const node_env = config_1.default.get('node_env');
        if (node_env === 'development')
            return next();
        try {
            const secretKey = config_1.default.get('recaptcha.secretKey');
            const recaptcha = req.body.recaptcha;
            const url = 'https://www.google.com/recaptcha/api/siteverify';
            const response = yield fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    secret: secretKey,
                    response: recaptcha,
                    remoteip: req.ip,
                }),
            });
            if (response.status !== 200)
                throw (0, helper_1.newError)(response.status, 'ไม่อนุญาติให้เข้าสู่ระบบ เนื่องจากการตรวจสอบ reCAPTCHA ไม่สำเร็จ');
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.verifyRecaptcha = verifyRecaptcha;
function verifyToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'verifyToken';
        try {
            const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '');
            if (!accessToken)
                throw (0, helper_1.newError)(403, 'ไม่พบ Token กรุณาเข้าสู่ระบบใหม่', true);
            const decoded = (0, jwt_1.verifyJwt)(accessToken, 'accessTokenPublicKey');
            if (!decoded)
                throw (0, helper_1.newError)(401, 'Token หมดอายุ, กรุณาเข้าสู่ระบบใหม่', true);
            res.locals.userId = decoded.userId;
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.verifyToken = verifyToken;
function isUserActive(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'isUserActive';
        try {
            const user = yield user_service_1.userService.findById(res.locals.userId);
            if (!user)
                throw (0, helper_1.newError)(404, 'ไม่พบข้อมูลผู้ใช้งานในระบบ', true);
            if (!user.active)
                throw (0, helper_1.newError)(401, `${user.email} บัญชีนี้ถูกระงับการใช้งาน`, true);
            res.locals.user = user.toJSON();
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.isUserActive = isUserActive;
function isRoleAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'isRoleAdmin';
        try {
            if (res.locals.user.role !== 'admin')
                throw (0, helper_1.newError)(401, `${res.locals.user.email} บัญชีนี้ไม่มีสิทธิ์เข้าถึงเนื้อหานี้`);
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.isRoleAdmin = isRoleAdmin;

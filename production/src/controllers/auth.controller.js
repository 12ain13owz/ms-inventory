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
exports.refreshTokenController = exports.logoutController = exports.loginController = void 0;
const config_1 = require("../../config");
const lodash_1 = require("lodash");
const user_service_1 = require("../services/user.service");
const helper_1 = require("../utils/helper");
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../utils/jwt");
const tokenKey = "refresh_token";
const isProduction = config_1.config.get("node_env") === "production";
function loginController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = "loginController";
        try {
            const email = (0, helper_1.normalizeUnique)(req.body.email);
            const user = yield user_service_1.userService.findByEmail(email);
            if (!user)
                throw (0, helper_1.newError)(404, `ไม่พบ E-mail: ${email}`);
            const isValidPassword = (0, helper_1.comparePassword)(req.body.password, user.password);
            if (!isValidPassword)
                throw (0, helper_1.newError)(401, "E-mail หรือ Password ไม่ตรงกัน");
            if (!user.active)
                throw (0, helper_1.newError)(401, `${email} บัญชีนี้ถูกระงับการใช้งาน`);
            const accessToken = (0, jwt_1.signAccessToken)(user.id);
            const refreshToken = (0, jwt_1.signRefreshToken)(user.id);
            if (!accessToken || !refreshToken)
                throw (0, helper_1.newError)(503, "ระบบไม่สามารถยืนยันตัวตนได้ กรุณาติดต่อ Admin");
            const resUser = (0, lodash_1.omit)(user.toJSON(), user_model_1.privateUserFields);
            const expiresCookie = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // milliseconds * seconds * minutes * hours * days
            res.clearCookie(tokenKey);
            res.cookie(tokenKey, refreshToken, {
                path: "/",
                expires: expiresCookie,
                httpOnly: true,
                sameSite: isProduction ? "lax" : "none",
                secure: true,
            });
            res.json({ accessToken, resUser });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.loginController = loginController;
function logoutController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = "logoutController";
        try {
            res.clearCookie(tokenKey);
            res.json({ message: "ออกจากระบบสำเร็จ" });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.logoutController = logoutController;
function refreshTokenController(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = "refreshTokenController";
        try {
            const accessToken = ((_a = req.headers.authorization) !== null && _a !== void 0 ? _a : "").replace(/^Bearer\s/, "");
            if (!accessToken)
                throw (0, helper_1.newError)(403, "ไม่พบ Token กรุณาเข้าสู่ระบบใหม่ (1)", true);
            const decodedAccessToken = (0, jwt_1.verifyAccessToken)(accessToken);
            if (decodedAccessToken && decodedAccessToken !== "jwt expired")
                throw (0, helper_1.newError)(401, "Token หมดอายุ, กรุณาเข้าสู่ระบบใหม่ (2)", true);
            const refreshToken = req.cookies[tokenKey];
            if (!refreshToken)
                throw (0, helper_1.newError)(401, "Token หมดอายุ, กรุณาเข้าสู่ระบบใหม่ (3)", true);
            const decodedRefreshToken = (0, jwt_1.verifyJwt)(refreshToken, "refreshTokenPublicKey");
            if (!decodedRefreshToken)
                throw (0, helper_1.newError)(401, "Token หมดอายุ, กรุณาเข้าสู่ระบบใหม่ (4)", true);
            const user = yield user_service_1.userService.findById(decodedRefreshToken.userId);
            if (!user)
                throw (0, helper_1.newError)(404, "ไม่พบข้อมูลผู้ใช้งานในระบบ", true);
            const newAccessToken = (0, jwt_1.signAccessToken)(user.id);
            const newRefreshToken = (0, jwt_1.signRefreshToken)(user.id);
            if (!newAccessToken || !newRefreshToken)
                throw (0, helper_1.newError)(503, "ระบบไม่สามารถยืนยันตัวตนได้ กรุณาติดต่อ Admin");
            const expiresCookie = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // milliseconds * seconds * minutes * hours * days
            res.clearCookie(tokenKey);
            res.cookie(tokenKey, newRefreshToken, {
                path: "/",
                expires: expiresCookie,
                httpOnly: true,
                sameSite: isProduction ? "lax" : "none",
                secure: true,
            });
            res.json({ accessToken: newAccessToken });
        }
        catch (error) {
            res.clearCookie(tokenKey);
            next(error);
        }
    });
}
exports.refreshTokenController = refreshTokenController;

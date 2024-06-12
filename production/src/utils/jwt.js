"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.verifyJwt = exports.signJwt = exports.signRefreshToken = exports.signAccessToken = void 0;
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = require("jsonwebtoken");
const logger_1 = __importDefault(require("./logger"));
function signAccessToken(userId) {
    try {
        const accessToken = signJwt({ userId }, "accessTokenPrivateKey", {
            expiresIn: "1d",
        });
        return accessToken;
    }
    catch (error) {
        const e = error;
        logger_1.default.error(`signAccessToken: ${e.message}`);
        return null;
    }
}
exports.signAccessToken = signAccessToken;
function signRefreshToken(userId) {
    try {
        const refreshtoken = signJwt({ userId }, "refreshTokenPrivateKey", {
            expiresIn: "7d",
        });
        return refreshtoken;
    }
    catch (error) {
        const e = error;
        logger_1.default.error(`signRefreshToken: ${e.message}`);
        return null;
    }
}
exports.signRefreshToken = signRefreshToken;
function signJwt(object, keyName, options) {
    try {
        const signingKey = config_1.default.get(keyName);
        return (0, jsonwebtoken_1.sign)(object, signingKey, Object.assign({ algorithm: "RS256" }, (options && options)));
    }
    catch (error) {
        const e = error;
        logger_1.default.error(`signJwt: ${e.message}`);
        return null;
    }
}
exports.signJwt = signJwt;
function verifyJwt(token, keyName) {
    try {
        const publicKey = config_1.default.get(keyName);
        const decode = (0, jsonwebtoken_1.verify)(token, publicKey);
        return decode;
    }
    catch (error) {
        const e = error;
        logger_1.default.error(`verifyJwt: ${e.message}`);
        return null;
    }
}
exports.verifyJwt = verifyJwt;
function verifyAccessToken(token) {
    try {
        const keyName = "accessTokenPublicKey";
        const publicKey = config_1.default.get(keyName);
        (0, jsonwebtoken_1.verify)(token, publicKey);
        return null;
    }
    catch (error) {
        const e = error;
        const errorMessage = e.message === "jwt expired" ? null : e.message;
        logger_1.default.error(`verifyAccessToken: ${e.message}`);
        return errorMessage;
    }
}
exports.verifyAccessToken = verifyAccessToken;

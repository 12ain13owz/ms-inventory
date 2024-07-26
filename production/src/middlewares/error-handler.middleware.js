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
const fs_1 = require("fs");
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const message = error.message || "Internal Server Error!";
        const status = (_a = error.status) !== null && _a !== void 0 ? _a : 500;
        const logout = error.logout || false;
        const func = (_b = res.locals.func) !== null && _b !== void 0 ? _b : "โunction not found ";
        const url = req.method + req.baseUrl + req.url;
        const image = res.locals.image || [];
        for (const element of image) {
            if ((0, fs_1.existsSync)(element))
                (0, fs_1.unlinkSync)(element);
        }
        logger_1.default.error(`${url}, ${func}: ${message}`);
        res.status(status).json({ message, logout });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.default = errorHandler;

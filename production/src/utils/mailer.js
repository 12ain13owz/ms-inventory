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
exports.sendEmail = void 0;
const config_1 = require("../../config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("./logger"));
const mailer = config_1.config.get("mailer");
const transporter = nodemailer_1.default.createTransport(Object.assign(Object.assign({}, mailer), { auth: {
        user: mailer.user,
        pass: mailer.pass,
    } }));
function sendEmail(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const info = yield transporter.sendMail(payload);
            logger_1.default.info(`Preview URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
            return info;
        }
        catch (error) {
            const e = error;
            logger_1.default.error(`sendEmail: ${e.message}`);
            return null;
        }
    });
}
exports.sendEmail = sendEmail;

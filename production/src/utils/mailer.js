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
const config_1 = __importDefault(require("config"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("./logger"));
const smtp = config_1.default.get('smtp');
const transporter = nodemailer_1.default.createTransport(Object.assign(Object.assign({}, smtp), { auth: {
        user: smtp.user,
        pass: smtp.pass,
    } }));
function sendEmail(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield transporter.sendMail(payload);
        }
        catch (error) {
            const e = error;
            logger_1.default.error(`sendEmail: ${e.message}`);
            return null;
        }
    });
}
exports.sendEmail = sendEmail;

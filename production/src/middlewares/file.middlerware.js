"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.reduceQualityImage = exports.upload = exports.setFuncName = exports.storage = void 0;
const multer_1 = __importStar(require("multer"));
const helper_1 = require("../utils/helper");
const fs_1 = require("fs");
const uuid_1 = require("uuid");
const jimp_1 = __importDefault(require("jimp"));
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
};
exports.storage = (0, multer_1.diskStorage)({
    destination: (req, file, cb) => {
        const path = './data/images';
        (0, fs_1.mkdirSync)(path, { recursive: true });
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = null;
        if (!isValid)
            error = (0, helper_1.newError)(400, 'ประเภทของไฟล์ไม่ถูกต้อง (png, jpg, jpeg)');
        cb(error, path);
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        const fileName = `${(0, uuid_1.v4)()}.${ext}`;
        cb(null, fileName);
    },
});
const setFuncName = (req, res, next) => {
    res.locals.func = 'uploadMiddleware';
    next();
};
exports.setFuncName = setFuncName;
exports.upload = (0, multer_1.default)({ storage: exports.storage }).single('image');
function reduceQualityImage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'reduceQualityImage';
        try {
            if (req.file) {
                const filePath = req.file.path;
                const fileName = `reduce-${req.file.filename}`;
                const fileImage = `${req.file.destination}/${fileName}`;
                res.locals.image = [];
                res.locals.image.push(filePath);
                res.locals.image.push(fileImage);
                const file = yield jimp_1.default.read(filePath);
                file.quality(80).write(fileImage);
                (0, fs_1.unlinkSync)(filePath);
                req.body.image = fileName;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.reduceQualityImage = reduceQualityImage;

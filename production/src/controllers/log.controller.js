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
exports.findLogByIdController = exports.findLogByCodeController = exports.findLogByTrackController = exports.findLogByDateController = exports.findAllLogController = exports.initialLogController = exports.searchLogByCodeController = void 0;
const helper_1 = require("../utils/helper");
const log_service_1 = require("../services/log.service");
function searchLogByCodeController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'searchLogByCodeController';
        try {
            const query = (0, helper_1.removeWhitespace)(req.query.code);
            const resLogs = yield log_service_1.logService.searchByCode(query);
            res.json(resLogs);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.searchLogByCodeController = searchLogByCodeController;
function initialLogController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'initialLogController';
        try {
            const logs = yield log_service_1.logService.findLimit(50);
            const resLogs = logs.sort((a, b) => a.id - b.id);
            res.json(resLogs);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.initialLogController = initialLogController;
function findAllLogController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'findAllLogController';
        try {
            const resLogs = yield log_service_1.logService.findAll();
            res.json(resLogs);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.findAllLogController = findAllLogController;
function findLogByDateController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'findLogByDateController';
        try {
            const dateStart = new Date(req.params.dateStart);
            const dateEnd = new Date(req.params.dateEnd);
            if (isNaN(dateStart.getTime()) || isNaN(dateEnd.getTime()))
                throw (0, helper_1.newError)(400, 'รูปแบบวันที่ไม่ถูกต้อง');
            dateStart.setHours(0, 0, 0, 0);
            dateEnd.setHours(23, 59, 59, 999);
            const resLogs = yield log_service_1.logService.findByDate(dateStart, dateEnd);
            res.json(resLogs);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.findLogByDateController = findLogByDateController;
function findLogByTrackController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'findLogByTrackController';
        try {
            const track = (0, helper_1.removeWhitespace)(req.params.track);
            const resLogs = yield log_service_1.logService.findByTrack(track);
            res.json(resLogs);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.findLogByTrackController = findLogByTrackController;
function findLogByCodeController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'findLogByCodeController';
        try {
            const code = (0, helper_1.removeWhitespace)(req.params.code);
            const resLogs = yield log_service_1.logService.findByCode(code);
            res.json(resLogs);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.findLogByCodeController = findLogByCodeController;
function findLogByIdController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'findLogByIdController';
        try {
            const id = +req.params.id;
            const resLog = yield log_service_1.logService.findById(id);
            res.json(resLog);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.findLogByIdController = findLogByIdController;

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
exports.deleteStatusController = exports.updateStatusController = exports.createStatusController = exports.findAllStatusController = void 0;
const lodash_1 = require("lodash");
const helper_1 = require("../utils/helper");
const status_model_1 = require("../models/status.model");
const status_service_1 = require("../services/status.service");
function findAllStatusController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'findAllStatusController';
        try {
            const statuses = yield status_service_1.statusService.findAll();
            res.json(statuses);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.findAllStatusController = findAllStatusController;
function createStatusController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'createStatusController';
        try {
            const name = (0, helper_1.removeWhitespace)(req.body.name);
            const status = yield status_service_1.statusService.findByName(name);
            if (status)
                throw (0, helper_1.newError)(400, `สถานะ ${name} ซ้ำ`);
            const payload = new status_model_1.Status({
                name: name,
                active: req.body.active,
                remark: req.body.remark || '',
            });
            const result = yield status_service_1.statusService.create(payload);
            const newStatus = (0, lodash_1.omit)(result.toJSON(), helper_1.privateFields);
            res.json({
                message: `เพิ่มสถานะ ${name} สำเร็จ`,
                item: newStatus,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.createStatusController = createStatusController;
function updateStatusController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'updateStatusController';
        try {
            const id = +req.params.id;
            const status = yield status_service_1.statusService.findById(id);
            if (!status)
                throw (0, helper_1.newError)(400, 'ไม่พบสถานะ');
            const name = (0, helper_1.removeWhitespace)(req.body.name);
            const existingStatus = yield status_service_1.statusService.findByName(name);
            if (existingStatus && existingStatus.id !== id)
                throw (0, helper_1.newError)(400, `ชื่อสถานะ ${name} ซ้ำ`);
            const payload = {
                name: name,
                active: req.body.active,
                remark: req.body.remark || '',
            };
            const [result] = yield status_service_1.statusService.update(id, payload);
            if (!result)
                throw (0, helper_1.newError)(400, `แก้ไขสถานะ ${name} ไม่สำเร็จ`);
            res.json({
                message: `แก้ไขสถานะ ${name} สำเร็จ`,
                item: payload,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateStatusController = updateStatusController;
function deleteStatusController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'deleteStatusController';
        try {
            const id = +req.params.id;
            const status = yield status_service_1.statusService.findById(id);
            if (!status)
                throw (0, helper_1.newError)(400, 'ไม่พบสถานะ ที่ต้องการลบ');
            const name = status.name;
            const result = yield status_service_1.statusService.delete(id);
            if (!result)
                throw (0, helper_1.newError)(400, `ลบสถานะ ${name} ไม่สำเร็จ`);
            res.json({ message: `ลบสถานะ ${name} สำเร็จ` });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.deleteStatusController = deleteStatusController;

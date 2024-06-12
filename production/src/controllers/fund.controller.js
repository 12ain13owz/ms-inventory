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
exports.deleteFundController = exports.updateFundController = exports.createFundController = exports.findAllFundController = void 0;
const lodash_1 = require("lodash");
const helper_1 = require("../utils/helper");
const fund_model_1 = require("../models/fund.model");
const fund_service_1 = require("../services/fund.service");
function findAllFundController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'findAllFundController';
        try {
            const funds = yield fund_service_1.fundService.findAll();
            res.json(funds);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.findAllFundController = findAllFundController;
function createFundController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'createFundController';
        try {
            const name = (0, helper_1.removeWhitespace)(req.body.name);
            const fund = yield fund_service_1.fundService.findByName(name);
            if (fund)
                throw (0, helper_1.newError)(400, `แหล่งเงิน ${name} ซ้ำ`);
            const payload = new fund_model_1.Fund({
                name: name,
                active: req.body.active,
                remark: req.body.remark || '',
            });
            const result = yield fund_service_1.fundService.create(payload);
            const newFund = (0, lodash_1.omit)(result.toJSON(), helper_1.privateFields);
            res.json({
                message: `เพิ่มแหล่งเงิน ${name} สำเร็จ`,
                item: newFund,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.createFundController = createFundController;
function updateFundController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'updateFundController';
        try {
            const id = +req.params.id;
            const fund = yield fund_service_1.fundService.findById(id);
            if (!fund)
                throw (0, helper_1.newError)(400, 'ไม่พบแหล่งเงิน');
            const name = (0, helper_1.removeWhitespace)(req.body.name);
            const existingFund = yield fund_service_1.fundService.findByName(name);
            if (existingFund && existingFund.id !== id)
                throw (0, helper_1.newError)(400, `แหล่งเงิน ${name} ซ้ำ`);
            const payload = {
                name: name,
                active: req.body.active,
                remark: req.body.remark || '',
            };
            const [result] = yield fund_service_1.fundService.update(id, payload);
            if (!result)
                throw (0, helper_1.newError)(400, `แก้ไขแหล่งเงิน ${name} ไม่สำเร็จ`);
            res.json({
                message: `แก้ไขแหล่งเงิน ${name} สำเร็จ`,
                item: payload,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateFundController = updateFundController;
function deleteFundController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'deleteFundController';
        try {
            const id = +req.params.id;
            const fund = yield fund_service_1.fundService.findById(id);
            if (!fund)
                throw (0, helper_1.newError)(400, 'ไม่พบแหล่งเงิน ที่ต้องการลบ');
            const name = fund.name;
            const result = yield fund_service_1.fundService.delete(id);
            if (!result)
                throw (0, helper_1.newError)(400, `ลบแหล่งเงิน ${name} ไม่สำเร็จ`);
            res.json({ message: `ลบแหล่งเงิน ${name} สำเร็จ` });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.deleteFundController = deleteFundController;

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
exports.checkLocationActive = exports.checkFundActive = exports.checkStatusActive = exports.checkCategoryActive = void 0;
const category_service_1 = require("../services/category.service");
const status_service_1 = require("../services/status.service");
const fund_service_1 = require("../services/fund.service");
const location_service_1 = require("../services/location.service");
function checkCategoryActive(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = "checkCategoryActive";
        try {
            const categoryId = +req.body.categoryId;
            const category = yield category_service_1.categoryService.findById(categoryId);
            if (!(category === null || category === void 0 ? void 0 : category.active))
                return res.status(400).json({ message: "ประเภทนี้ไม่สามารถใช้งานได้" });
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.checkCategoryActive = checkCategoryActive;
function checkStatusActive(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = "checkStatusActive";
        try {
            const statusId = +req.body.statusId;
            const status = yield status_service_1.statusService.findById(statusId);
            if (!(status === null || status === void 0 ? void 0 : status.active))
                return res.status(400).json({ message: "สถานะนี้ไม่สามารถใช้งานได้" });
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.checkStatusActive = checkStatusActive;
function checkFundActive(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = "checkFundActive";
        try {
            const fundId = +req.body.fundId;
            const fund = yield fund_service_1.fundService.findById(fundId);
            if (!(fund === null || fund === void 0 ? void 0 : fund.active))
                return res
                    .status(400)
                    .json({ message: "แหล่งเงินนี้ไม่สามารถใช้งานได้" });
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.checkFundActive = checkFundActive;
function checkLocationActive(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = "checkLocationActive";
        try {
            const locationId = +req.body.locationId;
            const location = yield location_service_1.locationService.findById(locationId);
            if (!(location === null || location === void 0 ? void 0 : location.active))
                return res.status(400).json({ message: "ห้องนี้ไม่สามารถใช้งานได้" });
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.checkLocationActive = checkLocationActive;

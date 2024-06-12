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
exports.deleteLocationController = exports.updateLocationController = exports.createLocationController = exports.findAllLocationController = void 0;
const lodash_1 = require("lodash");
const helper_1 = require("../utils/helper");
const location_model_1 = require("../models/location.model");
const location_service_1 = require("../services/location.service");
function findAllLocationController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'findAllLocationController';
        try {
            const locations = yield location_service_1.locationService.findAll();
            res.json(locations);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.findAllLocationController = findAllLocationController;
function createLocationController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'createLocationController';
        try {
            const name = (0, helper_1.removeWhitespace)(req.body.name);
            const location = yield location_service_1.locationService.findByName(name);
            if (location)
                throw (0, helper_1.newError)(400, `ห้อง ${name} ซ้ำ`);
            const payload = new location_model_1.Location({
                name: name,
                active: req.body.active,
                remark: req.body.remark || '',
            });
            const result = yield location_service_1.locationService.create(payload);
            const newLocation = (0, lodash_1.omit)(result.toJSON(), helper_1.privateFields);
            res.json({
                message: `เพิ่มห้อง ${name} สำเร็จ`,
                item: newLocation,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.createLocationController = createLocationController;
function updateLocationController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'updateLocationController';
        try {
            const id = +req.params.id;
            const location = yield location_service_1.locationService.findById(id);
            if (!location)
                throw (0, helper_1.newError)(400, 'ไม่พบห้อง');
            const name = (0, helper_1.removeWhitespace)(req.body.name);
            const existingLocation = yield location_service_1.locationService.findByName(name);
            if (existingLocation && existingLocation.id !== id)
                throw (0, helper_1.newError)(400, `ห้อง ${name} ซ้ำ`);
            const payload = {
                name: name,
                active: req.body.active,
                remark: req.body.remark || '',
            };
            const [result] = yield location_service_1.locationService.update(id, payload);
            if (!result)
                throw (0, helper_1.newError)(400, `แก้ไขห้อง ${name} ไม่สำเร็จ`);
            res.json({
                message: `แก้ไขห้อง ${name} สำเร็จ`,
                item: payload,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateLocationController = updateLocationController;
function deleteLocationController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'deleteLocationController';
        try {
            const id = +req.params.id;
            const location = yield location_service_1.locationService.findById(id);
            if (!location)
                throw (0, helper_1.newError)(400, 'ไม่พบห้อง ที่ต้องการลบ');
            const name = location.name;
            const result = yield location_service_1.locationService.delete(id);
            if (!result)
                throw (0, helper_1.newError)(400, `ลบห้อง ${name} ไม่สำเร็จ`);
            res.json({ message: `ลบห้อง ${name} สำเร็จ` });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.deleteLocationController = deleteLocationController;

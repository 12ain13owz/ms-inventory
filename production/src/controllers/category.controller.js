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
exports.deleteCategoryController = exports.updateCategoryController = exports.createCategoryController = exports.findAllCategoryController = void 0;
const lodash_1 = require("lodash");
const helper_1 = require("../utils/helper");
const category_model_1 = require("../models/category.model");
const category_service_1 = require("../services/category.service");
function findAllCategoryController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'findAllCategoryController';
        try {
            const resCategories = yield category_service_1.categoryService.findAll();
            res.json(resCategories);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.findAllCategoryController = findAllCategoryController;
function createCategoryController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'createCategoryController';
        try {
            const name = (0, helper_1.removeWhitespace)(req.body.name);
            const category = yield category_service_1.categoryService.findByName(name);
            if (category)
                throw (0, helper_1.newError)(400, `ประเภท ${name} ซ้ำ'`);
            const payload = new category_model_1.Category({
                name: name,
                active: req.body.active,
                remark: req.body.remark || '',
            });
            const result = yield category_service_1.categoryService.create(payload);
            const newCagegory = (0, lodash_1.omit)(result.toJSON(), helper_1.privateFields);
            res.json({
                message: `เพิ่มประเภท ${name} สำเร็จ`,
                item: newCagegory,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.createCategoryController = createCategoryController;
function updateCategoryController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'updateCategoryController';
        try {
            const id = +req.params.id;
            const cateogory = yield category_service_1.categoryService.findById(id);
            if (!cateogory)
                throw (0, helper_1.newError)(400, 'ไม่พบประเภท');
            const name = (0, helper_1.removeWhitespace)(req.body.name);
            const existingCategory = yield category_service_1.categoryService.findByName(name);
            if (existingCategory && existingCategory.id !== id)
                throw (0, helper_1.newError)(400, `ประเภท ${name} ซ้ำ'`);
            const payload = {
                name: name,
                active: req.body.active,
                remark: req.body.remark || '',
            };
            const [result] = yield category_service_1.categoryService.update(id, payload);
            if (!result)
                throw (0, helper_1.newError)(400, `แก้ไขประเภท ${name} ไม่สำเร็จ`);
            res.json({
                message: `แก้ไขประเภท ${name} สำเร็จ`,
                item: payload,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.updateCategoryController = updateCategoryController;
function deleteCategoryController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.func = 'deleteCategoryController';
        try {
            const id = +req.params.id;
            const category = yield category_service_1.categoryService.findById(id);
            if (!category)
                throw (0, helper_1.newError)(400, 'ไม่พบประเภท ที่ต้องการลบ');
            const name = category.name;
            const result = yield category_service_1.categoryService.delete(id);
            if (!result)
                throw (0, helper_1.newError)(400, `ลบประเภท ${name} ไม่สำเร็จ`);
            res.json({ message: `ลบประเภท ${name} สำเร็จ` });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.deleteCategoryController = deleteCategoryController;

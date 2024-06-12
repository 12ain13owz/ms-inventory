"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const inventory_controller_1 = require("../../controllers/inventory.controller");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const inventory_schema_1 = require("../../schemas/inventory.schema");
const file_middlerware_1 = require("../../middlewares/file.middlerware");
const check_active_middleware_1 = require("../../middlewares/check-active.middleware");
const router = (0, express_1.Router)();
router.get('/search', [auth_middleware_1.verifyToken, auth_middleware_1.isUserActive, (0, validate_middleware_1.validate)(inventory_schema_1.inventorySchema.search)], inventory_controller_1.searchInventoryController);
router.get('/search/code', [auth_middleware_1.verifyToken, auth_middleware_1.isUserActive, (0, validate_middleware_1.validate)(inventory_schema_1.inventorySchema.search)], inventory_controller_1.searchInventoryByCodeController);
router.get('/', [auth_middleware_1.verifyToken, auth_middleware_1.isUserActive], inventory_controller_1.findAllInventoryController);
router.get('/init', [auth_middleware_1.verifyToken, auth_middleware_1.isUserActive], inventory_controller_1.initialInventoryController);
router.get('/date/:dateStart/:dateEnd', [auth_middleware_1.verifyToken, auth_middleware_1.isUserActive, (0, validate_middleware_1.validate)(inventory_schema_1.inventorySchema.findByDate)], inventory_controller_1.findInventoryByDateController);
router.get('/track/:track', [auth_middleware_1.verifyToken, auth_middleware_1.isUserActive, (0, validate_middleware_1.validate)(inventory_schema_1.inventorySchema.findByTrack)], inventory_controller_1.findInventoryByTrackController);
router.get('/id/:id', [auth_middleware_1.verifyToken, auth_middleware_1.isUserActive, (0, validate_middleware_1.validate)(inventory_schema_1.inventorySchema.findById)], inventory_controller_1.findInventoryByIdController);
router.get('/code/:code', [auth_middleware_1.verifyToken, auth_middleware_1.isUserActive, (0, validate_middleware_1.validate)(inventory_schema_1.inventorySchema.findByCode)], inventory_controller_1.findInventoryByCodeController);
router.post('/', [
    auth_middleware_1.verifyToken,
    auth_middleware_1.isUserActive,
    file_middlerware_1.upload,
    file_middlerware_1.reduceQualityImage,
    (0, validate_middleware_1.validate)(inventory_schema_1.inventorySchema.create),
    check_active_middleware_1.checkCategoryActive,
    check_active_middleware_1.checkStatusActive,
    check_active_middleware_1.checkFundActive,
    check_active_middleware_1.checkLocationActive,
], inventory_controller_1.createInventoryController);
router.put('/:id', [
    auth_middleware_1.verifyToken,
    auth_middleware_1.isUserActive,
    file_middlerware_1.upload,
    file_middlerware_1.reduceQualityImage,
    (0, validate_middleware_1.validate)(inventory_schema_1.inventorySchema.update),
    check_active_middleware_1.checkCategoryActive,
    check_active_middleware_1.checkStatusActive,
    check_active_middleware_1.checkFundActive,
    check_active_middleware_1.checkLocationActive,
], inventory_controller_1.updateInventoryController);
// router.delete(
//   '/:id',
//   [validate(inventorySchema.delete), verifyToken, isUserActive],
//   deleteInventoryController
// );
exports.default = router;

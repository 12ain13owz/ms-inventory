"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const inventory_check_controller_1 = require("../../controllers/inventory-check.controller");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const inventory_check_schema_1 = require("../../schemas/inventory-check.schema");
const check_active_middleware_1 = require("../../middlewares/check-active.middleware");
const router = (0, express_1.Router)();
router.get('/', [auth_middleware_1.verifyToken, auth_middleware_1.isUserActive], inventory_check_controller_1.findAllInventoryCheckController);
router.get('/year/:year', [auth_middleware_1.verifyToken, auth_middleware_1.isUserActive, (0, validate_middleware_1.validate)(inventory_check_schema_1.inventoryCheckSehema.findByYear)], inventory_check_controller_1.findInventoryCheckByYearController);
router.get('/id/:id', [auth_middleware_1.verifyToken, auth_middleware_1.isUserActive, (0, validate_middleware_1.validate)(inventory_check_schema_1.inventoryCheckSehema.findById)], inventory_check_controller_1.findInventoryCheckByIdController);
router.post('/', [
    auth_middleware_1.verifyToken,
    auth_middleware_1.isUserActive,
    (0, validate_middleware_1.validate)(inventory_check_schema_1.inventoryCheckSehema.create),
    check_active_middleware_1.checkStatusActive,
], inventory_check_controller_1.createInventoryCheckController);
router.delete('/:id', [
    auth_middleware_1.verifyToken,
    auth_middleware_1.isUserActive,
    auth_middleware_1.isRoleAdmin,
    (0, validate_middleware_1.validate)(inventory_check_schema_1.inventoryCheckSehema.delete),
], inventory_check_controller_1.deleteInventoryCheckController);
exports.default = router;

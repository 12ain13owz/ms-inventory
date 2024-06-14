"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const helper_1 = require("../utils/helper");
const router = (0, express_1.Router)();
router.get("/health", (req, res, next) => {
    res.json({ message: "health check" });
});
router.get("/error", (req, res, next) => {
    res.locals.func = "Test Function Error";
    try {
        throw (0, helper_1.newError)(400, "Test message error!");
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const helper_1 = require("../utils/helper");
const validate = (schema) => (req, res, next) => {
    res.locals.func = 'validate';
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        let message = 'Validate Error';
        let status = 500;
        if (error instanceof zod_1.ZodError) {
            message = error.issues.map((issue) => issue.message).join(', ');
            status = 400;
        }
        next((0, helper_1.newError)(status, message));
    }
};
exports.validate = validate;

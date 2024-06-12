"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const config = {
    port: Number(process.env.PORT) || 3000,
    node_env: process.env.NODE_ENV || "development",
    database: {
        dialect: "sqlite",
        storage: process.env.DATABASE_URL || "./data/database/ms_inventory.sqlite",
    },
    smtp: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service: "gmail",
        user: process.env.USER_MAIL || "",
        pass: process.env.PASS_MAIL || "",
    },
    whiteList: process.env.WHITE_LIST || "",
    recaptcha: {
        siteKey: process.env.RECAPTCHA_SITE_KEY || "",
        secretKey: process.env.RECAPTCHA_SECRET_KEY || "",
    },
    accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY || "",
    accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY || "",
    refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY || "",
    refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY || "",
};
exports.default = config;

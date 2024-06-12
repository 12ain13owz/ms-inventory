"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const inventory_socket_1 = __importDefault(require("./inventory.socket"));
const log_socket_1 = __importDefault(require("./log.socket"));
const category_socket_1 = __importDefault(require("./category.socket"));
const status_socket_1 = __importDefault(require("./status.socket"));
const fund_socket_1 = __importDefault(require("./fund.socket"));
const location_socket_1 = __importDefault(require("./location.socket"));
let count = 0;
exports.default = (io) => {
    io.on('connection', (socket) => {
        count = io.engine.clientsCount;
        logger_1.default.info('User connected');
        logger_1.default.info('User count: ' + count);
        (0, inventory_socket_1.default)(io, socket);
        (0, log_socket_1.default)(io, socket);
        (0, category_socket_1.default)(io, socket);
        (0, status_socket_1.default)(io, socket);
        (0, fund_socket_1.default)(io, socket);
        (0, location_socket_1.default)(io, socket);
        socket.on('disconnect', () => {
            count--;
            logger_1.default.warn('User disconnected ' + count);
        });
    });
};

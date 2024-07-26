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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const config_1 = require("../config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const health_1 = __importDefault(require("./routes/health"));
const index_1 = __importDefault(require("./routes/v1/index"));
const error_handler_middleware_1 = __importDefault(require("./middlewares/error-handler.middleware"));
const connect_1 = require("./utils/connect");
const logger_1 = __importDefault(require("./utils/logger"));
const socket_1 = __importDefault(require("./socket"));
const app = (0, express_1.default)();
const port = config_1.config.get("port");
const whiteList = config_1.config.get("whiteList").split(",");
const corsOptions = {
    origin: whiteList,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
const server = (0, node_http_1.createServer)(app);
const socketOptions = {
    cors: { origin: corsOptions.origin },
};
const io = new socket_io_1.Server(server, socketOptions);
(0, socket_1.default)(io);
app.use((0, cors_1.default)(corsOptions));
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "../data/images")));
app.use(health_1.default);
app.use(index_1.default);
app.use(error_handler_middleware_1.default);
app.get("*.*", express_1.default.static(path_1.default.join(__dirname, "../dist/browser")));
app.all("*", (req, res) => {
    res.status(200).sendFile("/", { root: "dist/browser" });
});
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connect_1.databaseConnect)();
    logger_1.default.info(`Server listening at http://localhost:${port}`);
}));

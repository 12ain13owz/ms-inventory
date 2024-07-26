require("dotenv").config();
import { config } from "../config";
import express from "express";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { createServer } from "node:http";
import { Server } from "socket.io";

import healthRoutes from "./routes/health";
import userRoutesV1 from "./routes/v1/index";
import errorHandler from "./middlewares/error-handler.middleware";

import { databaseConnect } from "./utils/connect";
import log from "./utils/logger";
import socket from "./socket";

const app = express();
const port = config.get("port");
const whiteList = config.get("whiteList").split(",");
const corsOptions: CorsOptions = {
  origin: whiteList,
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const server = createServer(app);
const socketOptions = {
  cors: { origin: corsOptions.origin },
};
const io = new Server(server, socketOptions);
socket(io);

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "../data/images")));

app.use(healthRoutes);
app.use(userRoutesV1);
app.use(errorHandler);

app.get("*.*", express.static(path.join(__dirname, "../dist/browser")));
app.all("*", (req, res) => {
  res.status(200).sendFile("/", { root: "dist/browser" });
});

server.listen(port, async () => {
  await databaseConnect();
  log.info(`Server listening at http://localhost:${port}`);
});

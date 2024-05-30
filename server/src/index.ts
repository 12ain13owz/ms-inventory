import config from 'config';
import https from 'https';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

import healthRoutes from './routes/health';
import userRoutesV1 from './routes/v1/index';
import errorHandler from './middlewares/error-handler.middleware';

import { databaseConnect } from './utils/connect';
import log from './utils/logger';
import socket from './socket';
import { readFileSync } from 'fs';

const app = express();
const node_env = config.get<string>('node_env');
const port = config.get<number>('port');

const getCorsOptions = (env: string): CorsOptions => {
  if (env === 'production')
    return {
      origin: ['https://ms-stock-it.web.app'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    };
  else
    return {
      origin: [
        'https://localhost:' + port.toString(),
        'http://localhost:4200',
        'https://localhost:4200',
        'http://192.168.1.33:4200',
        'https://192.168.1.33:4200',
      ],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    };
};

const corsOptions = getCorsOptions(node_env);
const server =
  node_env === 'production'
    ? createServer(app)
    : https.createServer(
        {
          key: readFileSync(path.join('ssl_private.key')),
          cert: readFileSync(path.join('ssl.crt')),
        },
        app
      );

const socketOptions = {
  cors: { origin: corsOptions.origin },
};
const io = new Server(server, socketOptions);
socket(io);

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/images', express.static(path.join(__dirname, '../data/images')));

app.use(healthRoutes);
app.use(userRoutesV1);
app.use(errorHandler);

const staticPath = node_env === 'production' ? '../browser' : '../browser-dev';
const rootPath = node_env === 'production' ? 'browser' : 'browser-dev';

app.get('*.*', express.static(path.join(__dirname, staticPath)));
app.all('*', (req, res) => {
  res.status(200).sendFile('/', { root: rootPath });
});

server.listen(port, async () => {
  await databaseConnect();
  log.info(`Server listening at https://localhost:${port}`);
});

import config from 'config';
import https from 'https';
import fs from 'fs';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

import healthRoutes from './routes/health';
import userRoutesV1 from './routes/v1/index';
import errorHandler from './middlewares/error-handler.middleware';

import log from './utils/logger';
import { databaseConnect } from './utils/connect';

const https_options = {
  key: fs.readFileSync(path.join('D:/Project/certificates/ssl_private.key')),
  cert: fs.readFileSync(path.join('D:/Project/certificates/ssl.crt')),
};

const corsOptions: CorsOptions = {
  origin: ['https://localhost:4200', 'https://192.168.1.46:4200'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const app = express();
const port = config.get<number>('port');
const server = https.createServer(https_options, app);

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/image', express.static(path.join(__dirname, '../public/images')));

app.use(healthRoutes);
app.use(userRoutesV1);
app.use(errorHandler);

server.listen(port, async () => {
  await databaseConnect();
  log.info(`Server listening on port ${port}`);
});

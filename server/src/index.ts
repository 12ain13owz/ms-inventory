import config from 'config';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import healthRoutes from './routes/health';
import userRoutesV1 from './routes/v1/index';
import errorHandler from './middlewares/error-handler.middleware';

import log from './utils/logger';
import { databaseConnect } from './utils/connect';

const app = express();
const port = config.get<number>('port');
const corsOptions: CorsOptions = {
  origin: 'http://localhost:4200',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(healthRoutes);
app.use(userRoutesV1);
app.use(errorHandler);

app.listen(port, async () => {
  await databaseConnect();
  log.info(`Server listening on port ${port}`);
});

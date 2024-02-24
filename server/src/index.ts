import config from 'config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import healthRoutes from './routes/health';
import userRoutesV1 from './routes/v1/index';
import errorHandler from './middlewares/error-handler.middleware';

import log from './utils/logger';
import { databaseConnect } from './utils/connect';

const app = express();
const port = config.get<number>('port');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(healthRoutes);
app.use(userRoutesV1);
app.use(errorHandler);

app.listen(port, async () => {
  await databaseConnect();
  log.info(`Server listening on port ${port}`);
});

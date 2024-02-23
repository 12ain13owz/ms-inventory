import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import healthRoutes from './routes/health';
import userRoutesV1 from './routes/v1/index';

import log from './utils/logger';
import handlerError from './middlewares/handler-error.middleware';
import { databaseConnect } from './utils/connect';
import { generateAdmin } from './utils/generate';

const app = express();
const port = process.env.PORT || 3500;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(healthRoutes);
app.use(userRoutesV1);
app.use(handlerError);

app.listen(port, async () => {
  await databaseConnect();
  await generateAdmin();
  log.info(`Server listening on port ${port}`);
});

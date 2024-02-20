import express from 'express';
import morgan from 'morgan';

import log from './utils/logger';
import router from './routes';
import handlerError from './middlewares/handler-error.middleware';
import { databaseConnect } from './utils/connect';

const app = express();
const port = process.env.PORT || 3500;

app.use(morgan('dev'));
app.use(router);
app.use(handlerError);

app.listen(port, () => {
  log.info(`Server listening on port ${port}`);
  databaseConnect();
});

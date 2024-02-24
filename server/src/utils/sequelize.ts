import config from 'config';
import { Dialect, Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: config.get<Dialect>('database.dialect'),
  storage: config.get<string>('database.storage'),
});

export default sequelize;

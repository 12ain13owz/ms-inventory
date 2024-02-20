import { Sequelize } from 'sequelize';
import config from '../../config';

const sequelize = new Sequelize({
  dialect: config.database.dialect,
  storage: config.database.storage,
});

export default sequelize;

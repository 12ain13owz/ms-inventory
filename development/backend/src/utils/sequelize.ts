import { config } from "../../config";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: config.get("database").dialect,
  storage: config.get("database").storage,
});

export default sequelize;

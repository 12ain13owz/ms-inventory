import sequelize from './sequelize';
import '../models';
import log from './logger';

export async function databaseConnect(): Promise<void> {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    log.info('Connected to Database successfully');
  } catch (error) {
    console.log(error);

    const e = error as Error;
    log.error(`dbConnect: ${e.message}`);
    process.exit(1);
  }
}

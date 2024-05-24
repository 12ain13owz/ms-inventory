import { Transaction, Op } from 'sequelize';
import logModel, { Log } from '../models/log.model';

export const logService = {
  findAll(): Promise<Log[]> {
    return logModel.findAll();
  },

  findLimit(limit: number): Promise<Log[]> {
    return logModel.findAll({ limit: limit, order: [['createdAt', 'DESC']] });
  },

  findByDate(dateStart: Date, dateEnd: Date): Promise<Log[]> {
    return logModel.findAll({
      where: { createdAt: { [Op.between]: [dateStart, dateEnd] } },
    });
  },

  findByCode(code: string): Promise<Log[]> {
    return logModel.findAll({ where: { code } });
  },

  findByTrack(track: string): Promise<Log[]> {
    return logModel.findAll({ where: { track } });
  },

  findById(id: number): Promise<Log | null> {
    return logModel.findByPk(id);
  },

  create(log: Log, t: Transaction): Promise<Log> {
    return logModel.create(log.toJSON(), { transaction: t });
  },
};

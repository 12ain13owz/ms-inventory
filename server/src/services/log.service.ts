import { Transaction, Op } from 'sequelize';
import LogModel, { Log } from '../models/log.model';

export const logService = {
  findAll(): Promise<Log[]> {
    return LogModel.findAll();
  },

  findLimit(limit: number): Promise<Log[]> {
    return LogModel.findAll({ limit: limit, order: [['createdAt', 'DESC']] });
  },

  findByDate(dateStart: Date, dateEnd: Date): Promise<Log[]> {
    return LogModel.findAll({
      where: { createdAt: { [Op.between]: [dateStart, dateEnd] } },
    });
  },

  findByCode(code: string): Promise<Log[]> {
    return LogModel.findAll({ where: { code } });
  },

  findByTrack(track: string): Promise<Log[]> {
    return LogModel.findAll({ where: { track } });
  },

  findById(id: number): Promise<Log | null> {
    return LogModel.findByPk(id);
  },

  create(log: Log, t: Transaction): Promise<Log> {
    return LogModel.create(log.toJSON(), { transaction: t });
  },
};

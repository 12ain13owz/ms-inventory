import { Transaction, Op } from 'sequelize';
import logModel, { Log } from '../models/log.model';

export function findAllLog(): Promise<Log[]> {
  return logModel.findAll();
}

export function findLimitLog(limit: number): Promise<Log[]> {
  return logModel.findAll({
    limit: limit,
    order: [['createdAt', 'DESC']],
  });
}

export function findLogByTrack(track: string): Promise<Log[]> {
  return logModel.findAll({ where: { track } });
}

export function findLogByDate(dateStart: Date, dateEnd: Date) {
  return logModel.findAll({
    where: { createdAt: { [Op.between]: [dateStart, dateEnd] } },
  });
}

export function findLogById(id: number): Promise<Log | null> {
  return logModel.findByPk(id);
}

export function createLog(log: Log, t: Transaction): Promise<Log> {
  return logModel.create(log.toJSON(), { transaction: t });
}

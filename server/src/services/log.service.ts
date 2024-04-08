import { Transaction } from 'sequelize';
import logModel, { Log } from '../models/log.model';

export function findAllLog() {
  return logModel.findAll();
}

export function findLogByCode(code: string): Promise<Log | null> {
  return logModel.findOne({ where: { code } });
}

export function findLogByTrack(track: string): Promise<Log | null> {
  return logModel.findOne({ where: { track } });
}

export function createLog(log: Log, t: Transaction): Promise<Log> {
  return logModel.create(log.toJSON(), { transaction: t });
}

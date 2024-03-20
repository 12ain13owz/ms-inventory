import { Transaction } from 'sequelize';
import trackModel, { Track } from '../models/track.model';

export function createTrack(t: Transaction): Promise<Track> {
  return trackModel.create({}, { transaction: t });
}

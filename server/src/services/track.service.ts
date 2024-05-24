import { Transaction } from 'sequelize';
import trackModel, { Track } from '../models/track.model';

export const trackService = {
  create(t: Transaction): Promise<Track> {
    return trackModel.create({}, { transaction: t });
  },
};

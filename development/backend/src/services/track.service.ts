import { Transaction } from 'sequelize';
import TrackModel, { Track } from '../models/track.model';

export const trackService = {
  create(t: Transaction): Promise<Track> {
    return TrackModel.create({}, { transaction: t });
  },
};

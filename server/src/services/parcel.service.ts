import ParcelModel, { Parcel } from '../models/parcel.model';

export function findAllParcel() {
  return ParcelModel.findAll();
}

export function findParcelByTrack(track: string): Promise<Parcel | null> {
  return ParcelModel.findOne({ where: { track } });
}

export function createParcel(parcel: Parcel): Promise<Parcel> {
  return ParcelModel.create(parcel.dataValues);
}

export function updateParcel(
  id: number,
  parcel: Partial<Parcel>
): Promise<[affectedCount: number]> {
  return ParcelModel.update(parcel, { where: { id } });
}

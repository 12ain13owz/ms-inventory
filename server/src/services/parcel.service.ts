import { Transaction, Op } from 'sequelize';
import parcelModel, { Parcel, ParcelData } from '../models/parcel.model';
import categoryModel from '../models/category.model';
import statusModel from '../models/status.model';
import userModel from '../models/user.model';

export function findAllParcel(): Promise<ParcelData[]> {
  return parcelModel.findAll<ParcelData>(getParcelQueryOptions());
}

export function findParcelByTrack(track: string): Promise<ParcelData | null> {
  return parcelModel.findOne<ParcelData>({
    where: { track },
    ...getParcelQueryOptions(),
  });
}

export function findParcelById(id: number): Promise<ParcelData | null> {
  return parcelModel.findByPk(id, {
    ...getParcelQueryOptions(),
  });
}

export function findParcelByCode(code: string): Promise<ParcelData | null> {
  return parcelModel.findOne({
    where: { code },
    ...getParcelQueryOptions(),
  });
}

export function findParcelsByDate(
  dateStart: Date,
  dateEnd: Date
): Promise<ParcelData[]> {
  return parcelModel.findAll<ParcelData>({
    where: { createdAt: { [Op.between]: [dateStart, dateEnd] } },
    ...getParcelQueryOptions(),
  });
}

export function createParcel(parcel: Parcel, t: Transaction): Promise<Parcel> {
  return parcelModel.create(parcel.toJSON(), { transaction: t });
}

export function updateParcel(
  id: number,
  parcel: Partial<Parcel>,
  t: Transaction
): Promise<[affectedCount: number]> {
  return parcelModel.update(parcel, { where: { id }, transaction: t });
}

export function updateQuantityParcel(
  id: number,
  quantity: number,
  t: Transaction
): Promise<[affectedCount: number]> {
  return parcelModel.update({ quantity }, { where: { id }, transaction: t });
}

export function deleteParcel(id: number): Promise<number> {
  return parcelModel.destroy({ where: { id } });
}

function getParcelQueryOptions() {
  return {
    attributes: { exclude: ['UserId', 'CategoryId', 'StatusId'] },
    include: [
      { model: userModel, attributes: ['firstname', 'lastname'] },
      { model: categoryModel, attributes: ['id', 'name'] },
      { model: statusModel, attributes: ['id', 'name'] },
    ],
  };
}

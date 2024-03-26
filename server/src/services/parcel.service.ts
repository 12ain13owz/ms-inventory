import { Transaction, Op } from 'sequelize';
import parcelModel, { Parcel, ParcelData } from '../models/parcel.model';
import categoryModel from '../models/category.model';
import statusModel from '../models/status.model';
import userModel from '../models/user.model';

export function findAllParcel(): Promise<ParcelData[]> {
  return parcelModel.findAll<ParcelData>({
    attributes: { exclude: ['UserId', 'CategoryId', 'StatusId'] },
    include: [
      { model: userModel, attributes: ['firstname', 'lastname'] },
      { model: categoryModel, attributes: ['name'] },
      { model: statusModel, attributes: ['name'] },
    ],
  });
}

export function findParcelById(id: number): Promise<ParcelData | null> {
  return parcelModel.findByPk<ParcelData>(id, {
    include: [
      { model: categoryModel, attributes: ['name'] },
      { model: statusModel, attributes: ['name'] },
    ],
  });
}

export function findParcelByTrack(track: string): Promise<ParcelData | null> {
  return parcelModel.findOne<ParcelData>({
    where: { track },
    attributes: { exclude: ['UserId', 'CategoryId', 'StatusId'] },
    include: [
      { model: userModel, attributes: ['firstname', 'lastname'] },
      { model: categoryModel, attributes: ['name'] },
      { model: statusModel, attributes: ['name'] },
    ],
  });
}

export function findParcelByCode(code: string): Promise<Parcel | null> {
  return parcelModel.findOne({ where: { code } });
}

export function findParcelsByDate(
  dateStart: Date,
  dateEnd: Date
): Promise<ParcelData[]> {
  return parcelModel.findAll<ParcelData>({
    where: { createdAt: { [Op.between]: [dateStart, dateEnd] } },
    attributes: { exclude: ['UserId', 'CategoryId', 'StatusId'] },
    include: [
      { model: userModel, attributes: ['firstname', 'lastname'] },
      { model: categoryModel, attributes: ['name'] },
      { model: statusModel, attributes: ['name'] },
    ],
  });
}

export function createParcel(parcel: Parcel, t: Transaction): Promise<Parcel> {
  return parcelModel.create(parcel.dataValues, { transaction: t });
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

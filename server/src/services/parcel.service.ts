import { Transaction, Op } from 'sequelize';
import parcelModel, { Parcel, ParcelData } from '../models/parcel.model';
import { Category } from '../models/category.model';
import { Status } from '../models/status.model';
import { User } from '../models/user.model';

export function findAllParcel() {
  return parcelModel.findAll(getParcelQueryOptions());
}

export function findParcelByTrack(track: string) {
  return parcelModel.findOne({
    where: { track },
    ...getParcelQueryOptions(),
  });
}

export function findParcelById(id: number) {
  return parcelModel.findByPk(id, {
    ...getParcelQueryOptions(),
  });
}

export function findParcelByCode(code: string) {
  return parcelModel.findOne({
    where: { code },
    ...getParcelQueryOptions(),
  });
}

export function findParcelsByDate(dateStart: Date, dateEnd: Date) {
  return parcelModel.findAll({
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
      { model: User, attributes: ['firstname', 'lastname'] },
      { model: Category, attributes: ['id', 'name'] },
      { model: Status, attributes: ['id', 'name'] },
    ],
  };
}

import { Transaction } from 'sequelize';
import parcelModel, { Parcel } from '../models/parcel.model';
import categoryModel from '../models/category.model';
import statusModel from '../models/status.model';

export function findAllParcel() {
  return parcelModel.findAll();
}

export function findParcelById(id: number): Promise<Parcel | null> {
  return parcelModel.findByPk(id, {
    include: [
      {
        model: categoryModel,
        attributes: {
          exclude: ['id', 'active', 'remark', 'createdAt', 'updatedAt'],
        },
      },
      {
        model: statusModel,
        attributes: {
          exclude: ['id', 'active', 'remark', 'createdAt', 'updatedAt'],
        },
      },
    ],
  });
}

export function findParcelByCode(code: string): Promise<Parcel | null> {
  return parcelModel.findOne({ where: { code } });
}

export function findParcelByTrack(track: string): Promise<Parcel | null> {
  return parcelModel.findOne({ where: { track } });
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

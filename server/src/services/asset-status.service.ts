import { Op } from 'sequelize';
import AssetStatusModel, { AssetStatus } from '../models/asset-status.model';

export const assetStatusService = {
  findAll(): Promise<AssetStatus[]> {
    return AssetStatusModel.findAll({ ...queryOptions() });
  },

  findById(id: number): Promise<AssetStatus | null> {
    return AssetStatusModel.findByPk(id, { ...queryOptions() });
  },

  findByName(name: string): Promise<AssetStatus | null> {
    return AssetStatusModel.findOne({
      where: { name: { [Op.like]: name } },
      ...queryOptions(),
    });
  },

  create(assetStatus: AssetStatus): Promise<AssetStatus> {
    return AssetStatusModel.create(assetStatus.toJSON());
  },

  update(
    id: number,
    assetStatus: Partial<AssetStatus>
  ): Promise<[affectedCount: number]> {
    return AssetStatusModel.update(assetStatus, { where: { id } });
  },

  delete(id: number): Promise<number> {
    return AssetStatusModel.destroy({ where: { id } });
  },
};

function queryOptions() {
  return { attributes: { exclude: ['createdAt', 'updatedAt'] } };
}

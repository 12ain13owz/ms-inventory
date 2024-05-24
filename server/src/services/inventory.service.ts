import { Transaction, Op } from 'sequelize';
import inventoryModel, { Inventory } from '../models/inventory.model';
import { User } from '../models/user.model';
import { Category } from '../models/category.model';
import { AssetStatus } from '../models/asset-status.model';
import { UsageStatus } from '../models/usage-status.model';

export const inventoryService = {
  findAll(): Promise<Inventory[]> {
    return inventoryModel.findAll({ ...queryOptions() });
  },

  findLimit(limit: number): Promise<Inventory[]> {
    return inventoryModel.findAll({
      limit: limit,
      order: [['createdAt', 'DESC']],
      ...queryOptions(),
    });
  },

  findById(id: number): Promise<Inventory | null> {
    return inventoryModel.findByPk(id, { ...queryOptions() });
  },

  findByTrack(track: string): Promise<Inventory | null> {
    return inventoryModel.findOne({ where: { track }, ...queryOptions() });
  },

  findByCode(code: string): Promise<Inventory | null> {
    return inventoryModel.findOne({ where: { code }, ...queryOptions() });
  },

  findByDate(dateStart: Date, dateEnd: Date): Promise<Inventory[]> {
    return inventoryModel.findAll({
      where: { createdAt: { [Op.between]: [dateStart, dateEnd] } },
      ...queryOptions(),
    });
  },

  create(inventory: Inventory, t: Transaction): Promise<Inventory> {
    return inventoryModel.create(inventory.toJSON(), {
      transaction: t,
    });
  },

  update(
    id: number,
    inventory: Partial<Inventory>,
    t: Transaction
  ): Promise<[affectedCount: number]> {
    return inventoryModel.update(inventory, {
      where: { id },
      transaction: t,
    });
  },

  delete(id: number): Promise<number> {
    return inventoryModel.destroy({ where: { id } });
  },
};

function queryOptions() {
  return {
    attributes: {
      exclude: ['userId', 'categoryId', 'assetStatusId', 'usageStatusId'],
    },
    include: [
      { model: User, attributes: ['firstname', 'lastname'] },
      { model: Category, attributes: ['id', 'name'] },
      { model: AssetStatus, attributes: ['id', 'name'] },
      { model: UsageStatus, attributes: ['id', 'name'] },
    ],
  };
}

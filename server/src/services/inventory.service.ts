import { Transaction, Op } from 'sequelize';
import InventoryModel, { Inventory } from '../models/inventory.model';
import { User } from '../models/user.model';
import { Category } from '../models/category.model';
import { Status } from '../models/status.model';
import { Usage } from '../models/usage.model';

export const inventoryService = {
  findAll(): Promise<Inventory[]> {
    return InventoryModel.findAll({ ...queryOptions() });
  },

  findLimit(limit: number): Promise<Inventory[]> {
    return InventoryModel.findAll({
      limit: limit,
      order: [['createdAt', 'DESC']],
      ...queryOptions(),
    });
  },

  findById(id: number): Promise<Inventory | null> {
    return InventoryModel.findByPk(id, { ...queryOptions() });
  },

  findByTrack(track: string): Promise<Inventory | null> {
    return InventoryModel.findOne({ where: { track }, ...queryOptions() });
  },

  findByCode(code: string): Promise<Inventory | null> {
    return InventoryModel.findOne({ where: { code }, ...queryOptions() });
  },

  findByDate(dateStart: Date, dateEnd: Date): Promise<Inventory[]> {
    return InventoryModel.findAll({
      where: { createdAt: { [Op.between]: [dateStart, dateEnd] } },
      ...queryOptions(),
    });
  },

  create(inventory: Inventory, t: Transaction): Promise<Inventory> {
    return InventoryModel.create(inventory.toJSON(), {
      transaction: t,
    });
  },

  update(
    id: number,
    inventory: Partial<Inventory>,
    t: Transaction
  ): Promise<[affectedCount: number]> {
    return InventoryModel.update(inventory, {
      where: { id },
      transaction: t,
    });
  },

  delete(id: number): Promise<number> {
    return InventoryModel.destroy({ where: { id } });
  },
};

function queryOptions() {
  return {
    attributes: {
      exclude: ['userId', 'categoryId', 'statusId', 'usageId'],
    },
    include: [
      { model: User, attributes: ['firstname', 'lastname'] },
      { model: Category, attributes: ['id', 'name'] },
      { model: Status, attributes: ['id', 'name'] },
      { model: Usage, attributes: ['id', 'name'] },
    ],
  };
}

import { Op, col, fn, where } from 'sequelize';
import InventoryCheckModel, {
  InventoryCheck,
} from '../models/inventory-check.model';
import { Inventory } from '../models/inventory.model';
import { User } from '../models/user.model';
import { Category } from '../models/category.model';
import { AssetStatus } from '../models/asset-status.model';
import { UsageStatus } from '../models/usage-status.model';

export const inventoryCheckService = {
  findAll(): Promise<InventoryCheck[]> {
    return InventoryCheckModel.findAll({ ...queryOptions() });
  },

  findByYear(year: number): Promise<InventoryCheck[]> {
    return InventoryCheckModel.findAll({
      where: { year: year },
      ...queryOptions(),
    });
  },

  findById(id: number): Promise<InventoryCheck | null> {
    return InventoryCheckModel.findByPk(id, { ...queryOptions() });
  },

  findByInventoryId(id: number, year: number): Promise<InventoryCheck | null> {
    return InventoryCheckModel.findOne({
      where: {
        inventoryId: id,
        year: year,
      },
      ...queryOptions(),
    });
  },

  create(inventoryCheck: InventoryCheck): Promise<InventoryCheck> {
    return InventoryCheckModel.create(inventoryCheck.toJSON());
  },
};

function queryOptions() {
  return {
    attributes: {
      exclude: ['inventoryId'],
    },
    include: [
      {
        model: Inventory,
        attributes: {
          exclude: ['userId', 'categoryId', 'assetStatusId', 'usageStatusId'],
        },
        include: [
          { model: User, attributes: ['firstname', 'lastname'] },
          { model: Category, attributes: ['name'] },
          { model: AssetStatus, attributes: ['name'] },
          { model: UsageStatus, attributes: ['name'] },
        ],
      },
    ],
  };
}

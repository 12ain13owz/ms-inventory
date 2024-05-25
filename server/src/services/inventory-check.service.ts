import InventoryCheckModel, {
  InventoryCheck,
} from '../models/inventory-check.model';
import { Inventory } from '../models/inventory.model';
import { User } from '../models/user.model';
import { Category } from '../models/category.model';
import { Status } from '../models/status.model';
import { Usage } from '../models/usage.model';

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
          exclude: ['userId', 'categoryId', 'statusId', 'usageId'],
        },
        include: [
          { model: User, attributes: ['firstname', 'lastname'] },
          { model: Category, attributes: ['name'] },
          { model: Status, attributes: ['name'] },
          { model: Usage, attributes: ['name'] },
        ],
      },
    ],
  };
}

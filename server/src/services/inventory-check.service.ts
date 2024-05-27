import InventoryCheckModel, {
  InventoryCheck,
} from '../models/inventory-check.model';
import { Inventory } from '../models/inventory.model';
import { User } from '../models/user.model';
import { Category } from '../models/category.model';
import { Status } from '../models/status.model';
import { Fund } from '../models/fund.model';
import { Location } from '../models/location.model';

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
      exclude: ['inventoryId', 'createdAt'],
    },
    include: [
      {
        model: Inventory,
        attributes: {
          exclude: ['userId', 'categoryId', 'statusId', 'fundId', 'locationId'],
        },
        include: [
          { model: User, attributes: ['firstname', 'lastname'] },
          { model: Category, attributes: ['name'] },
          { model: Status, attributes: ['name'] },
          { model: Fund, attributes: ['name'] },
          { model: Location, attributes: ['name'] },
        ],
      },
    ],
  };
}

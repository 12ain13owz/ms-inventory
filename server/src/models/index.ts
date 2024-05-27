import './user.model';
import './track.model';
import './inventory.model';
import './category.model';
import './status.model';
import './fund.model';
import './log.model';
import { Inventory } from './inventory.model';
import { InventoryCheck } from './inventory-check.model';
import { User } from './user.model';
import { Category } from './category.model';
import { Status } from './status.model';
import { Fund } from './fund.model';
import { Location } from './location.model';

Inventory.belongsTo(User, { foreignKey: 'userId' });
Inventory.belongsTo(Category, { foreignKey: 'categoryId' });
Inventory.belongsTo(Status, { foreignKey: 'statusId' });
Inventory.belongsTo(Fund, { foreignKey: 'fundId' });
Inventory.belongsTo(Location, { foreignKey: 'locationId' });

User.hasMany(Inventory, { foreignKey: 'userId' });
Category.hasMany(Inventory, { foreignKey: 'categoryId' });
Status.hasMany(Inventory, { foreignKey: 'statusId' });
Fund.hasMany(Inventory, { foreignKey: 'fundId' });
Location.hasMany(Inventory, { foreignKey: 'locationId' });

InventoryCheck.belongsTo(Inventory, { foreignKey: 'inventoryId' });
Inventory.hasMany(InventoryCheck, { foreignKey: 'inventoryId' });

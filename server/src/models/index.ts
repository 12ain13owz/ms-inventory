import './user.model';
import './track.model';
import './inventory.model';
import './category.model';
import './status.model';
import './usage.model';
import './log.model';
import { Inventory } from './inventory.model';
import { InventoryCheck } from './inventory-check.model';
import { User } from './user.model';
import { Category } from './category.model';
import { Status } from './status.model';
import { Usage } from './usage.model';

Inventory.belongsTo(User, { foreignKey: 'userId' });
Inventory.belongsTo(Category, { foreignKey: 'categoryId' });
Inventory.belongsTo(Status, { foreignKey: 'statusId' });
Inventory.belongsTo(Usage, { foreignKey: 'usageId' });

User.hasMany(Inventory, { foreignKey: 'userId' });
Category.hasMany(Inventory, { foreignKey: 'categoryId' });
Status.hasMany(Inventory, { foreignKey: 'statusId' });
Usage.hasMany(Inventory, { foreignKey: 'usageId' });

InventoryCheck.belongsTo(Inventory, { foreignKey: 'inventoryId' });
Inventory.hasMany(InventoryCheck, { foreignKey: 'inventoryId' });

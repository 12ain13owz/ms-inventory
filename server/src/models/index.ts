import './user.model';
import './track.model';
import './inventory.model';
import './category.model';
import './asset-status.model';
import './usage-status.model';
import './log.model';
import { Inventory } from './inventory.model';
import { InventoryCheck } from './inventory-check.model';
import { User } from './user.model';
import { Category } from './category.model';
import { AssetStatus } from './asset-status.model';
import { UsageStatus } from './usage-status.model';

Inventory.belongsTo(User, { foreignKey: 'userId' });
Inventory.belongsTo(Category, { foreignKey: 'categoryId' });
Inventory.belongsTo(AssetStatus, { foreignKey: 'assetStatusId' });
Inventory.belongsTo(UsageStatus, { foreignKey: 'usageStatusId' });

User.hasMany(Inventory, { foreignKey: 'userId' });
Category.hasMany(Inventory, { foreignKey: 'categoryId' });
AssetStatus.hasMany(Inventory, { foreignKey: 'assetStatusId' });
UsageStatus.hasMany(Inventory, { foreignKey: 'usageStatusId' });

InventoryCheck.belongsTo(Inventory, { foreignKey: 'inventoryId' });
Inventory.hasMany(InventoryCheck, { foreignKey: 'inventoryId' });

import { User } from "./user.model";
import { Inventory } from "./inventory.model";
import { Category } from "./category.model";
import { Status } from "./status.model";
import { Fund } from "./fund.model";
import { InventoryCheck } from "./inventory-check.model";
import { Location } from "./location.model";
import "./track.model";
import "./log.model";

Inventory.belongsTo(User, { foreignKey: "userId" });
Inventory.belongsTo(Category, { foreignKey: "categoryId" });
Inventory.belongsTo(Status, { foreignKey: "statusId" });
Inventory.belongsTo(Fund, { foreignKey: "fundId" });
Inventory.belongsTo(Location, { foreignKey: "locationId" });

User.hasMany(Inventory, { foreignKey: "userId" });
Category.hasMany(Inventory, { foreignKey: "categoryId" });
Status.hasMany(Inventory, { foreignKey: "statusId" });
Fund.hasMany(Inventory, { foreignKey: "fundId" });
Location.hasMany(Inventory, { foreignKey: "locationId" });

InventoryCheck.belongsTo(Inventory, { foreignKey: "inventoryId" });
Inventory.hasMany(InventoryCheck, { foreignKey: "inventoryId" });

import { Inventory, InventoryTable } from './inventory.model';
import { Log } from './log.model';

export interface InventoryCheck {
  id: number;
  year: number;
  Inventory: Inventory;
}

export interface InventoryCheckWithLog {
  inventoryCheck: InventoryCheck;
  log: Log;
}

export interface InventoryCheckTable extends InventoryTable {
  inventoryId: number;
  year: number;
}

export interface InventoryCheckPayload {
  inventoryId: number;
  statusId: number;
  statusName: string;
}

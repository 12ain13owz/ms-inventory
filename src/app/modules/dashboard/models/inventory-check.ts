import { Inventory, InventoryTable } from './inventory.model';

export interface InventoryCheck {
  id: number;
  year: number;
  Inventory: Inventory;
}

export interface InventoryCheckTable extends InventoryTable {
  year: number;
}

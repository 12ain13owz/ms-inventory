import { Message } from '../../shared/models/response.model';
import { Inventory, InventoryTable } from './inventory.model';

export interface InventoryCheck {
  id: number;
  year: number;
  Inventory: Inventory;
}

export interface InCheckPayload {
  inventoryId: number;
}

export interface InCheckResponse extends Message {
  inventoryCheck: InventoryCheck;
}

export interface InventoryCheckTable extends InventoryTable {
  year: number;
}

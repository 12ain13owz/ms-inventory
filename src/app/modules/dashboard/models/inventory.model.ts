import { Message } from '../../shared/models/response.model';
import { Log } from './log.model';

export interface Inventory {
  id?: number;
  track?: string;
  code: string;
  oldCode: string;
  description: string;
  unit: string;
  value: number;
  receivedDate: Date;
  fundingSource: string;
  location: string;
  remark: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  User: { firstname: string; lastname: string };
  Category: { id: number; name: string };
  Status: { id: number; name: string };
  Usage: { id: number; name: string };
}

export interface InventoryResponse extends Message {
  inventory: Inventory;
  log: Log;
}

export interface FilterInventory {
  categories: string[];
  statuses: string[];
  usages: string[];
}

export interface InventoryTable {
  id: number;
  no: number;
  image: string;
  code: string;
  category: string;
  status: string;
  usage: string;
  description: string;
}

export interface InventoryScan {
  id: number;
  image: string;
  code: string;
  description: string;
}

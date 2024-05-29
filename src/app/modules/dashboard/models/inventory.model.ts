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
  remark: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  User: { firstname: string; lastname: string };
  Category: { id: number; name: string };
  Status: { id: number; name: string };
  Fund: { id: number; name: string };
  Location: { id: number; name: string };
}

export interface InventoryWithLog {
  inventory: Inventory;
  log: Log;
}

export interface InventoryTable {
  id: number;
  track: string;
  no: number;
  image: string;
  code: string;
  category: string;
  status: string;
  fund: string;
  location: string;
  description: string;
}

export interface InventoryScan {
  id: number;
  image: string;
  code: string;
  track: string;
  Status: { id: number; name: string };
  description: string;
}

export interface InventoryPrint {
  id: number;
  track: string;
  image: string;
  code: string;
  description: string;
  printCount: number;
  fileUrl?: string;
}

export interface InventoryFilter {
  categories: string[];
  statuses: string[];
}

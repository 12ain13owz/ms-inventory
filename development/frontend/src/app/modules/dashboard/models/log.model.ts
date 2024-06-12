export interface Log {
  id: number;
  track: string;
  code: string;
  oldCode: string;
  description: string;
  unit: string;
  value: number;
  receivedDate: string;
  remark: string;
  image: string;
  isCreated: boolean;
  firstname: string;
  lastname: string;
  categoryName: string;
  statusName: string;
  fundName: string;
  locationName: string;
  createdAt: string;
}

export interface LogTable extends Log {
  no: number;
}

export interface FilterLog {
  inventories: string[];
  categories: string[];
  statuses: string[];
}

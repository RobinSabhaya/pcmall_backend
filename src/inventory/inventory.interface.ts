import { Inventory } from './schema/inventory.schema';

export enum InventoryType {
  IN = 'IN',
  OUT = 'OUT',
  RESERVE = 'RESERVE',
  RELEASE = 'RELEASE',
  ADJUSTMENT = 'ADJUSTMENT',
}

export interface ICreateUpdateInventoryResponse {
  success: boolean;
  message: string;
  data: {
    inventoryData: Inventory | null;
  };
}

export interface ICreateUpdateInventory {
  message: string;
  inventoryData: Inventory | null;
}

export interface IDeleteInventoryResponse {
  success: boolean;
  message: string;
  data: {
    inventoryData: Inventory | null;
  };
}
export interface IDeleteInventory {
  message: string;
  inventoryData: Inventory | null;
}

export interface IGetAllInventoriesResponse {
  success: boolean;
  data: {
    inventoryData: Inventory[];
  };
}

export interface IGetAllInventories {
  inventoryData: Inventory[];
}

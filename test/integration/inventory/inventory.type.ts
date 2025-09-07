import { IInventory } from '../../../src/models/inventory';

export interface ICreateUpdateInventoryResponse {
  data: { inventoryData: IInventory };
}

export interface IGetAllInventoryResponse {
  data: { inventoryData: IInventory[] };
}

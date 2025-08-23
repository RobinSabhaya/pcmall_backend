import { IInventory } from '../../../src/models/inventory';

export interface ICreateUpdateInventoryResponse {
  data: IInventory;
}

export interface IGetAllInventoryResponse {
  data: IInventory[];
}

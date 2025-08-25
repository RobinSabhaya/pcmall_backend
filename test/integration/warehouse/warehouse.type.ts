import { IWarehouse } from '../../../src/models/warehouse';

export interface ICreateUpdateWarehouseResponse {
  data: IWarehouse;
}

export interface IGetAllWarehousesResponse {
  data: IWarehouse[];
}

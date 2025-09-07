import { IWarehouse } from '../../../src/models/warehouse';

export interface ICreateUpdateWarehouseResponse {
  data: { warehouseData: IWarehouse };
}

export interface IGetAllWarehousesResponse {
  data: { warehouseData: IWarehouse[] };
}

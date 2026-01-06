import { Warehouse } from './schema/warehouse.schema';

export interface ICreateUpdateWarehouseResponse {
  success: boolean;
  message: string;
  data: {
    warehouseData: Warehouse | null;
  };
}

export interface ICreateUpdateWarehouse {
  message: string;
  warehouseData: Warehouse | null;
}

export interface IDeleteWarehouseResponse {
  success: boolean;
  message: string;
  data: {
    warehouseData: Warehouse | null;
  };
}
export interface IDeleteWarehouse {
  message: string;
  warehouseData: Warehouse | null;
}

export interface IGetAllWarehousesResponse {
  success: boolean;
  data: {
    warehouseData: Warehouse[];
  };
}

export interface IGetAllWarehouses {
  warehouseData: Warehouse[];
}

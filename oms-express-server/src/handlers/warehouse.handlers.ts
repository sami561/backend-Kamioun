import { Request, Response } from 'express';
import warehouseModel from '../model/warehouse.model';
import { NotFoundError } from '../errors/not-found.error';
import fetchAndStoreWarehouses from '../utils/fetchWarehouses';

export const getAllWarehouses = async (req: Request, res: Response): Promise<void> => {
  const count = await warehouseModel.countDocuments();
  if (count === 0) {
    await fetchAndStoreWarehouses();
  }
  const warehouses = await warehouseModel.find({});
  res.json(warehouses);
};

export const getWarehouse = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let warehouse = await warehouseModel.findById(id);

  if (!warehouse) {
    await fetchAndStoreWarehouses();
    warehouse = await warehouseModel.findById(id);
    if (!warehouse) {
      throw new NotFoundError('Warehouse not found');
    }
  }

  res.json(warehouse);
};

import { Request, Response } from 'express';
import SupplierModel from '../model/supplier.model';
import { NotFoundError } from '../errors/not-found.error';
import fetchAndStoreSuppliers from '../utils/fetchSuppliers';

export const getAllSuppliers = async (req: Request, res: Response): Promise<void> => {
  const count = await SupplierModel.countDocuments();
  if (count === 0) {
    await fetchAndStoreSuppliers();
  }
  const suppliers = await SupplierModel.find({});
  res.json(suppliers);
};

export const getSupplier = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let supplier = await SupplierModel.findOne({ manufacturerId: id });

  if (!supplier) {
    await fetchAndStoreSuppliers();
    supplier = await SupplierModel.findOne({ manufacturerId: id });
    if (!supplier) {
      throw new NotFoundError('Supplier not found');
    }
  }

  res.json(supplier);
};

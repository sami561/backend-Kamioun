import { NotFoundError } from "../errors/not-found.error";
import { Request, Response } from "express";
import supplierModel from "../Model/supplier.model";

export const getAllSuppliers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const suppliers = await supplierModel.find({});
  res.json(suppliers);
};

export const createSupplier = async (
  req: Request,
  res: Response
): Promise<void> => {
  const supplier = await supplierModel.create(req.body);
  res.json(supplier);
};

export const deleteSupplier = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const deletedSupplier = await supplierModel.findByIdAndDelete(id);

  if (!deletedSupplier) {
    throw new NotFoundError("Supplier not found!");
  }

  res.json(deletedSupplier);
};
 
export const updateSupplier = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const supplier = await supplierModel.findOneAndUpdate(
    {
      _id: id,
    },
    req.body,
    {
      new: true,
    }
  );

  if (!supplier) {
    throw new NotFoundError("Supplier not found!");
  }

  res.json(supplier);
};

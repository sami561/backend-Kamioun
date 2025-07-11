import { Request, Response } from 'express';
import ProductStockModel from '../model/product_stock.model';
import { NotFoundError } from '../errors/not-found.error';
import fetchProductStock from '../utils/fetchProductStock';

export const getAllProductStocks = async (req: Request, res: Response): Promise<void> => {
  const count = await ProductStockModel.countDocuments();
  if (count === 0) {
    await fetchProductStock();
  }
  const productStocks = await ProductStockModel.find({});
  res.json(productStocks);
};

export const getProductStock = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let productStock = await ProductStockModel.findById(id);

  if (!productStock) {
    await fetchProductStock();
    productStock = await ProductStockModel.findById(id);
    if (!productStock) {
      throw new NotFoundError('Product Stock not found');
    }
  }

  res.json(productStock);
};

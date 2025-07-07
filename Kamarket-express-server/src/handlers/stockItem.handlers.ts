import { Request, Response } from "express";
import { NotFoundError } from "../errors/not-found.error";
import stockItemModel from "../Model/stockItem.model";

export const getAllStockItems = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const stockItems = await stockItemModel.find({});
  res.json(stockItems);
};

export const getStockItemById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const stockItem = await stockItemModel.findById(id);

  if (!stockItem) {
    throw new NotFoundError("Stock item not found!");
  }

  res.json(stockItem);
};

export const createStockItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const stockItem = await stockItemModel.create(req.body);
  res.status(201).json(stockItem);
};

export const updateStockItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const stockItem = await stockItemModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!stockItem) {
    throw new NotFoundError("Stock item not found!");
  }

  res.json(stockItem);
};

export const deleteStockItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const stockItem = await stockItemModel.findByIdAndDelete(id);

  if (!stockItem) {
    throw new NotFoundError("Stock item not found!");
  }

  res.json({ message: "Stock item deleted successfully" });
};

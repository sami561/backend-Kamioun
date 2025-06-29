import { Request, Response } from 'express';
import OrderModel from '../model/order.model';
import { NotFoundError } from '../errors/not-found.error';
import fetchAndStoreOrders from '../utils/fetchOrders';

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  const count = await OrderModel.countDocuments();
  if (count === 0) {
    await fetchAndStoreOrders();
  }
  const orders = await OrderModel.find({});
  res.json(orders);
};

export const getOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  let order = await OrderModel.findById(id);

  if (!order) {
    await fetchAndStoreOrders();
    order = await OrderModel.findById(id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }
  }

  res.json(order);
};

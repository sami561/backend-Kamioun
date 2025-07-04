import { NotFoundError } from "../errors/not-found.error";
import OrderModel from "../Model/order.modal";
import { Request, Response } from "express";
export const getAllOrders = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const orders = await OrderModel.find({});
  res.json(orders);
};
export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const order = await OrderModel.create({
    ...req.body,
  });

  res.json(order);
};

export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const deletedOrder = await OrderModel.findByIdAndDelete(id);

  res.json(deletedOrder);
};
export const updateOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const order = await OrderModel.findOneAndUpdate(
    {
      _id: id,
    },
    req.body,
    {
      new: true,
    }
  );

  if (!order) {
    throw new NotFoundError("order not found!");
  }

  res.json(order);
};

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

export const getCustomerOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }
  const orders = await OrderModel.find({ customer_id: userId });
  res.json(orders);
};

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }
  const order = await OrderModel.create({
    ...req.body,
    customer_id: userId,
    state: "new",
    status: "pending",
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

export const getCompletedOrderTotals = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const orders = await OrderModel.find({ status: "completed" });
  const total = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  res.json({ total });
};

export const getOrdersByMonth = async (
  req: Request,
  res: Response
): Promise<void> => {
  const year = parseInt(req.query.year as string, 10);
  const month = parseInt(req.query.month as string, 10);
  if (!year || !month || month < 1 || month > 12) {
    res.status(400).json({ message: "Invalid year or month" });
    return;
  }
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  const orders = await OrderModel.find({
    created_at: { $gte: start, $lt: end },
  });
  res.json(orders);
};

export const getCompletedOrdersByMonth = async (
  req: Request,
  res: Response
): Promise<void> => {
  const year = parseInt(req.query.year as string, 10);
  const month = parseInt(req.query.month as string, 10);
  if (!year || !month || month < 1 || month > 12) {
    res.status(400).json({ message: "Invalid year or month" });
    return;
  }
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  const orders = await OrderModel.find({
    status: "completed",
    created_at: { $gte: start, $lt: end },
  });
  res.json(orders);
};
export const getOrdersByDay = async (
  req: Request,
  res: Response
): Promise<void> => {
  const dateStr = req.query.date as string;
  if (!dateStr) {
    res.status(400).json({ message: "Missing date parameter" });
    return;
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    res.status(400).json({ message: "Invalid date format" });
    return;
  }
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);

  const orders = await OrderModel.find({
    created_at: { $gte: date, $lt: nextDay },
  });
  res.json(orders);
};

export const getGvmPerMonth = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const result = await OrderModel.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: {
          year: { $year: "$delivery_date" },
          month: { $month: "$delivery_date" },
        },
        gvm: { $sum: "$total" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
  res.json(result);
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { status, description } = req.body;

  if (!status) {
    res.status(400).json({ message: "Status is required" });
    return;
  }

  const order = await OrderModel.findById(id);
  if (!order) {
    throw new NotFoundError("Order not found!");
  }

  // Add lifecycle event
  const lifecycleEvent = {
    state: order.state,
    status: status,
    date: new Date(),
    description: description || `Status updated to ${status}`,
  };

  const updatedOrder = await OrderModel.findOneAndUpdate(
    { _id: id },
    {
      status: status,
      $push: { lifecycle: lifecycleEvent },
    },
    { new: true }
  );

  res.json(updatedOrder);
};

export const updateOrderState = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { state, description } = req.body;

  if (!state) {
    res.status(400).json({ message: "State is required" });
    return;
  }

  const order = await OrderModel.findById(id);
  if (!order) {
    throw new NotFoundError("Order not found!");
  }

  // Add lifecycle event
  const lifecycleEvent = {
    state: state,
    status: order.status,
    date: new Date(),
    description: description || `State updated to ${state}`,
  };

  const updatedOrder = await OrderModel.findOneAndUpdate(
    { _id: id },
    {
      state: state,
      $push: { lifecycle: lifecycleEvent },
    },
    { new: true }
  );

  res.json(updatedOrder);
};

export const updateOrderStatusAndState = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { status, state, description } = req.body;

  if (!status && !state) {
    res.status(400).json({ message: "At least status or state is required" });
    return;
  }

  const order = await OrderModel.findById(id);
  if (!order) {
    throw new NotFoundError("Order not found!");
  }

  // Prepare update object
  const updateData: any = {};
  if (status) updateData.status = status;
  if (state) updateData.state = state;

  // Add lifecycle event
  const lifecycleEvent = {
    state: state || order.state,
    status: status || order.status,
    date: new Date(),
    description:
      description ||
      `Updated to state: ${state || order.state}, status: ${
        status || order.status
      }`,
  };

  updateData.$push = { lifecycle: lifecycleEvent };

  const updatedOrder = await OrderModel.findOneAndUpdate(
    { _id: id },
    updateData,
    { new: true }
  );

  res.json(updatedOrder);
};

import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  updateOrder,
  getCustomerOrders,
  getCompletedOrderTotals,
  getOrdersByMonth,
  getCompletedOrdersByMonth,
  getOrdersByDay,
  getGvmPerMonth,
  updateOrderStatus,
  updateOrderState,
  updateOrderStatusAndState,
} from "../handlers/order.handelers";
import jwtMiddleware from "../middlewares/jwt.middleware";
import { Request, Response } from "express";

const router = Router();
router.get("/all", jwtMiddleware, getAllOrders);
router.get("/customer", jwtMiddleware, getCustomerOrders);
router.get("/totals/completed", jwtMiddleware, getCompletedOrderTotals);
router.get("/by-month", jwtMiddleware, getOrdersByMonth);
router.get("/completed-by-month", jwtMiddleware, getCompletedOrdersByMonth);
router.post("/", jwtMiddleware, createOrder);
router.put("/:id", jwtMiddleware, updateOrder);
router.delete("/:id", jwtMiddleware, deleteOrder);
router.get("/by-day", jwtMiddleware, getOrdersByDay);
router.get("/gvm-per-month", jwtMiddleware, getGvmPerMonth);

// New routes for updating order status and state
router.put("/:id/status", jwtMiddleware, updateOrderStatus);
router.put("/:id/state", jwtMiddleware, updateOrderState);
router.put("/:id/status-state", jwtMiddleware, updateOrderStatusAndState);

export default router;

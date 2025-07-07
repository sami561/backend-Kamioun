import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  updateOrder,
  getCustomerOrders,
} from "../handlers/order.handelers";
import jwtMiddleware from "../middlewares/jwt.middleware";
const router = Router();
router.get("/all", jwtMiddleware, getAllOrders);
router.get("/customer", jwtMiddleware, getCustomerOrders);
router.post("/", jwtMiddleware, createOrder);
router.put("/:id", jwtMiddleware, updateOrder);
router.delete("/:id", jwtMiddleware, deleteOrder);
export default router;

import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  updateOrder,
} from "../handlers/order.handelers";
const router = Router();
router.get("/all", getAllOrders);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
export default router;

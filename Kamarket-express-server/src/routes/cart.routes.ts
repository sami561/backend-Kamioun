import { Router } from "express";
import {
  getCart,
  getCartByUserId,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../handlers/cart.handlers";
import jwtMiddleware from "../middlewares/jwt.middleware";

const router = Router();

// All cart routes require JWT authentication
router.get("/", jwtMiddleware, getCart);
router.get("/customer", jwtMiddleware, getCartByUserId);
router.post("/add", jwtMiddleware, addToCart);
router.put("/item/:productId", jwtMiddleware, updateCartItem);
router.delete("/item/:productId", jwtMiddleware, removeFromCart);
router.delete("/clear", jwtMiddleware, clearCart);

export default router;

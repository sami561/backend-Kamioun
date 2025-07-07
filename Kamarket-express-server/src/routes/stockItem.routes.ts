import { Router } from "express";
import {
  getAllStockItems,
  getStockItemById,
  createStockItem,
  updateStockItem,
  deleteStockItem,
} from "../handlers/stockItem.handlers";

const router = Router();

// GET all stock items
router.get("/all", getAllStockItems);

// GET stock item by ID
router.get("/:id", getStockItemById);

// POST create new stock item
router.post("/create", createStockItem);

// PUT update stock item
router.put("/:id", updateStockItem);

// DELETE stock item
router.delete("/:id", deleteStockItem);

export default router;

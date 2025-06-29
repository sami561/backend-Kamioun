import { Router } from "express";
import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  updateSupplier,
} from "../handlers/supplier.handlers";

const router = Router();

router.get("/all", getAllSuppliers);
router.post("/create", createSupplier);
router.delete("/:id", deleteSupplier);
router.put("/:id", updateSupplier);

export default router;

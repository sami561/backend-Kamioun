import { Router } from "express";
import { uploadMiddleware } from "../middlewares/file-upload.middleware";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  updateBrand,
} from "../handlers/brand.handlers";

const router = Router();

router.get("/all", getAllBrands);
router.post("/create", uploadMiddleware.single("image"), createBrand);
router.put("/:id", uploadMiddleware.single("image"), updateBrand);
router.delete("/:id", deleteBrand);

export default router;

import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  getProductsByBrand,
  getProductsByCategory,
  getProductsByBrandAndCategory,
} from "../handlers/product.handelers";
import { uploadMiddleware } from "../middlewares/file-upload.middleware";

const router = Router();

router.get("/all", getAllProducts);
router.get("/:id", getProductById);
router.get("/brand/:brandId", getProductsByBrand);
router.get("/category/:categoryId", getProductsByCategory);
router.get(
  "/brand/:brandId/category/:categoryId",
  getProductsByBrandAndCategory
);
router.post(
  "/create",
  uploadMiddleware.fields([{ name: "image", maxCount: 5 }]),
  createProduct
);
router.put(
  "/:id",
  uploadMiddleware.fields([{ name: "image", maxCount: 5 }]),
  updateProduct
);
router.delete("/:id", deleteProduct);

export default router;

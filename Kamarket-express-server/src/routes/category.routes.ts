import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
  getCategoryImage,
} from "../handlers/category.handelers";
import { uploadMiddleware } from "../middlewares/file-upload.middleware";

const router = Router();

router.get("/all", getAllCategories);
router.post("/create", uploadMiddleware.single("image"), createCategory);
router.delete("/:id", deleteCategory);
router.put("/:id", uploadMiddleware.single("image"), updateCategory);
router.get("/image/uploads/category/:filename", getCategoryImage);

export default router;

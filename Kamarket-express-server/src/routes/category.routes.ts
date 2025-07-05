import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
  getCategoryImage,
} from "../handlers/category.handelers";
import { uploadMiddleware } from "../middlewares/file-upload.middleware";
import jwtMiddleware from "../middlewares/jwt.middleware";

const router = Router();

// Public route for serving images
router.get("/image/uploads/category/:filename", getCategoryImage);

// Protected routes - require valid JWT token
router.get("/all", jwtMiddleware, getAllCategories);
router.post(
  "/create",
  jwtMiddleware,
  uploadMiddleware.single("image"),
  createCategory
);
router.delete("/:id", jwtMiddleware, deleteCategory);
router.put(
  "/:id",
  jwtMiddleware,
  uploadMiddleware.single("image"),
  updateCategory
);

export default router;

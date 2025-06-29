import { NotFoundError } from "../errors/not-found.error";
import categoryModel from "../Model/category.model";
import { Request, Response } from "express";
import { saveFile, deleteFile } from "../utils/file.utils";
import path from "path";
import fs from "fs";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const getAllCategories = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const Categories = await categoryModel.find({});
  res.json(Categories);
};

export const createCategory = async (
  req: MulterRequest,
  res: Response
): Promise<void> => {
  if (!req.file) {
    throw new Error("Image file is required");
  }

  const imagePath = saveFile(req.file, "category");

  const category = await categoryModel.create({
    ...req.body,
    image: imagePath,
  });

  res.json(category);
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const deletedCategory = await categoryModel.findByIdAndDelete(id);

  if (deletedCategory?.image) {
    deleteFile(deletedCategory.image);
  }

  res.json(deletedCategory);
};

export const updateCategory = async (
  req: MulterRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const updateData: any = { ...req.body };

  if (req.file) {
    const oldCategory = await categoryModel.findById(id);
    if (oldCategory?.image) {
      deleteFile(oldCategory.image);
    }
    updateData.image = saveFile(req.file, "category");
  }

  const category = await categoryModel.findOneAndUpdate(
    {
      _id: id,
    },
    updateData,
    {
      new: true,
    }
  );

  if (!category) {
    throw new NotFoundError("category not found!");
  }

  res.json(category);
};

export const getCategoryImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, "../../uploads/category", filename);

  if (!fs.existsSync(imagePath)) {
    throw new NotFoundError("Image not found");
  }

  res.sendFile(imagePath);
};

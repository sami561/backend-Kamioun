import { NotFoundError } from "../errors/not-found.error";
import { Request, Response } from "express";
import productModel from "../Model/product.model";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(__dirname, "../../uploads/products");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const saveImage = async (file: Express.Multer.File): Promise<string> => {
  const fileExtension = path.extname(file.originalname);
  const fileName = `${uuidv4()}${fileExtension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  await fs.promises.writeFile(filePath, file.buffer);
  return `/uploads/products/${fileName}`;
};

export const getAllProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const products = await productModel.find({}).populate("stock_item");
  res.json(products);
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const imageFiles = files?.image || [];
  const imagePaths = await Promise.all(
    imageFiles.map((file) => saveImage(file))
  );

  const product = await productModel.create({
    ...req.body,
    image: imagePaths,
  });

  res.json(product);
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const product = await productModel.findById(id);
  if (!product) {
    throw new NotFoundError("Product not found!");
  }

  // Delete associated images
  if (product.image && product.image.length > 0) {
    await Promise.all(
      product.image.map(async (imagePath) => {
        const fullPath = path.join(__dirname, "../../", imagePath);
        if (fs.existsSync(fullPath)) {
          await fs.promises.unlink(fullPath);
        }
      })
    );
  }

  const deletedProduct = await productModel.findByIdAndDelete(id);
  res.json(deletedProduct);
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const imageFiles = files?.image || [];

  const product = await productModel.findById(id);
  if (!product) {
    throw new NotFoundError("Product not found!");
  }

  // Handle image updates
  let imagePaths = product.image || [];
  if (imageFiles.length > 0) {
    // Delete old images if new ones are being uploaded
    if (imagePaths.length > 0) {
      await Promise.all(
        imagePaths.map(async (imagePath) => {
          const fullPath = path.join(__dirname, "../../", imagePath);
          if (fs.existsSync(fullPath)) {
            await fs.promises.unlink(fullPath);
          }
        })
      );
    }
    imagePaths = await Promise.all(imageFiles.map((file) => saveImage(file)));
  }

  const updatedProduct = await productModel.findOneAndUpdate(
    { _id: id },
    { ...req.body, image: imagePaths },
    { new: true }
  );

  res.json(updatedProduct);
};

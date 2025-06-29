import { NotFoundError } from "../errors/not-found.error";
import { Request, Response } from "express";
import { saveFile, deleteFile } from "../utils/file.utils";
import brandModel from "../Model/brand.model";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const getAllBrands = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const brands = await brandModel.find({});
  res.json(brands);
};

export const createBrand = async (
  req: MulterRequest,
  res: Response
): Promise<void> => {
  if (!req.file) {
    throw new Error("Image file is required");
  }

  const imagePath = saveFile(req.file, "brand");

  const brand = await brandModel.create({
    ...req.body,
    image: imagePath,
  });

  res.json(brand);
};

export const deleteBrand = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const deletedBrand = await brandModel.findByIdAndDelete(id);

  if (!deletedBrand) {
    throw new NotFoundError("Brand not found!");
  }

  if (deletedBrand.image) {
    deleteFile(deletedBrand.image);
  }

  res.json(deletedBrand);
};

export const updateBrand = async (
  req: MulterRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const updateData: any = { ...req.body };

  if (req.file) {
    const oldBrand = await brandModel.findById(id);
    if (oldBrand?.image) {
      deleteFile(oldBrand.image);
    }
    updateData.image = saveFile(req.file, "brand");
  }

  const brand = await brandModel.findOneAndUpdate(
    {
      _id: id,
    },
    updateData,
    {
      new: true,
    }
  );

  if (!brand) {
    throw new NotFoundError("Brand not found!");
  }

  res.json(brand);
};

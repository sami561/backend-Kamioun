import { Request, Response } from 'express';
import AdModel from '../model/ad.model';
import { NotFoundError } from '../errors/not-found.error';
import fs from 'fs';
import path from 'path';
import { InternalError } from '../errors/internal.error';
import mongoose from 'mongoose';
/* export const createAd = async (req: Request, res: Response): Promise<void> => {
  try {
    const ad = await AdModel.create({
      ...req.body,
      imageUrl: [],
    });

    const adFolder = path.join(__dirname, '../../uploads', ad._id.toString());
    if (!fs.existsSync(adFolder)) {
      fs.mkdirSync(adFolder, { recursive: true });
    }

    const imageUrls = (req.files as Express.Multer.File[]).map((file) => {
      const newPath = path.join(adFolder, file.filename);
      fs.renameSync(file.path, newPath);
      return `/uploads/${ad._id}/${file.filename}`;
    });

    ad.imageUrl = imageUrls;
    await ad.save();

    res.json(ad);
  } catch (error) {
    throw new InternalError();
  }
}; */
export const createAd = async (req: Request, res: Response): Promise<void> => {
  const ad = await AdModel.create({
    ...req.body,
  });

  res.json(ad);
};

export const updateAd = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ad = await AdModel.findById(id);
    if (!ad) {
      throw new NotFoundError('Ad not found!');
    }

    const adFolder = path.join(__dirname, '../../uploads', ad._id.toString());
    if (!fs.existsSync(adFolder)) {
      fs.mkdirSync(adFolder, { recursive: true });
    }

    const files =
      (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

    const imageFiles = files['images'] || [];
    const imageUrls = imageFiles.map((file) => {
      const newPath = path.join(adFolder, file.filename);
      fs.renameSync(file.path, newPath);
      return `/uploads/${ad._id}/${file.filename}`;
    });

    const backgroundImageFile = files['backgroundImage']?.[0];
    let backgroundImageUrl = ad.backgroundImage;
    if (backgroundImageFile) {
      const newPath = path.join(adFolder, backgroundImageFile.filename);
      fs.renameSync(backgroundImageFile.path, newPath);
      backgroundImageUrl = `/uploads/${ad._id}/${backgroundImageFile.filename}`;
    }

    if (req.body.product) {
      const productIds = Array.isArray(req.body.product)
        ? req.body.product
        : JSON.parse(req.body.product);
      req.body.product = productIds.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      );
      ad.product = req.body.product;
    }
    ad.imageUrl = [...(ad.imageUrl || []), ...imageUrls];
    ad.backgroundImage = backgroundImageUrl;
    Object.assign(ad, req.body);
    await ad.save();

    res.json(ad);
  } catch (error) {
    console.error('Error in updateAd:', error);
    throw new InternalError();
  }
};
export const getAds = async (_req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 10 } = _req.query;

  const pageNumber = parseInt(page as string, 10);
  const pageLimit = parseInt(limit as string, 10);

  try {
    if (pageNumber < 1 || pageLimit < 1) {
      res
        .status(400)
        .json({ error: 'Page number and limit must be positive integers' });
      return;
    }

    const ads = await AdModel.find({})
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);

    const totalAds = await AdModel.countDocuments();

    res.json({
      ads,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalAds / pageLimit),
        totalAds,
        pageLimit,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteAd = async (req: Request, res: Response) => {
  const { id } = req.params;

  const ad = await AdModel.findOneAndDelete({
    _id: id,
  });

  if (!ad) {
    throw new NotFoundError('ad not found!');
  }

  res.json(ad);
};
export const getAdsByPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { screen } = req.query;

    if (!screen) {
      throw new NotFoundError('page not found!');
    }

    const ads = await AdModel.find({ screen }).populate('product');

    res.json(ads);
  } catch (error) {
    throw new InternalError();
  }
};
export const getAdImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, filename } = req.params;
    const adFolder = path.join(__dirname, '../../uploads', id);
    if (!fs.existsSync(adFolder)) {
      throw new NotFoundError('No images found');
    }
    const files = fs.readdirSync(adFolder);
    if (files.length === 0) {
      throw new NotFoundError('No images found');
    }
    const imagePath = path.join(adFolder, filename);
    res.sendFile(imagePath);
  } catch (error) {
    throw new InternalError();
  }
};
export const getAd = async (req: Request, res: Response) => {
  const { id } = req.params;

  const branch = await AdModel.findById(id).populate('product');

  res.json(branch);
};
export const getImageByFullPath = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { filePath } = req.params;
    const fullImagePath = path.join(__dirname, '../../uploads', filePath);

    if (!fs.existsSync(fullImagePath)) {
      throw new NotFoundError('Image not found');
    }

    res.sendFile(fullImagePath);
  } catch (error) {
    throw new InternalError();
  }
};
export const getImage = (req: Request, res: Response): void => {
  try {
    const { folder, filename } = req.params;
    const imagePath = path.join(__dirname, '../../uploads', folder, filename);

    if (!fs.existsSync(imagePath)) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

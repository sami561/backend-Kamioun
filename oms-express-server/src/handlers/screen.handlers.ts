import { Request, Response } from 'express';
import screenModel from '../model/screen.model';
import { NotFoundError } from '../errors/not-found.error';
import { InternalError } from '../errors/internal.error';
import { ScreenStatus } from '../types/screen.types';
import { AuthenticatedRequest } from '../middlewares/apiKeyMiddleware';
export const createScreen = async (
  req: Request,
  res: Response
): Promise<void> => {
  const screen = await screenModel.create({
    ...req.body,
  });

  res.json(screen);
};

export const deleteScreen = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const deletedScreen = await screenModel.findByIdAndDelete(id);

  res.json(deletedScreen);
};
export const getAllScreens = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const screens = await screenModel.find({}).populate('ad');
  res.json(screens);
};
export const getScreens = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { page = 1, limit = 10 } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const pageLimit = parseInt(limit as string, 10);

  try {
    if (pageNumber < 1 || pageLimit < 1) {
      res
        .status(400)
        .json({ error: 'Page number and limit must be positive integers' });
      return;
    }
    const screens = await screenModel
      .find({})
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit)
      .populate('ad');

    const totalAds = await screenModel.countDocuments();

    res.json({
      screens,
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

export const getScreen = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const screen = await screenModel.findById(id).populate({
    path: 'ad',
    populate: {
      path: 'product',
      model: 'Product',
    },
  });

  res.json(screen);
};

export const updateScreen = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const screen = await screenModel.findOneAndUpdate(
    {
      _id: id,
    },
    req.body,
    {
      new: true,
    }
  );

  if (!screen) {
    throw new NotFoundError('screen not found!');
  }

  res.json(screen);
};
export const activateScreen = async (req: Request, res: Response) => {
  try {
    const { screenId } = req.params;

    const screen = await screenModel.findById(screenId);
    if (!screen) {
      throw new NotFoundError('Screen not found!');
    }

    await screenModel.updateMany(
      {
        title: screen.title,
        status: ScreenStatus.ACTIVE,
        _id: { $ne: screenId },
      },
      { status: ScreenStatus.INACTIVE }
    );

    const updatedScreen = await screenModel.findByIdAndUpdate(
      screenId,
      { status: ScreenStatus.ACTIVE },
      { new: true }
    );

    res
      .status(200)
      .json({ message: 'Screen activated successfully', updatedScreen });
  } catch (error) {
    res.status(500).json({ message: 'Failed to activate screen', error });
  }
};

export const deactivateScreen = async (req: Request, res: Response) => {
  try {
    const { screenId } = req.params;
    const screen = await screenModel.findByIdAndUpdate(
      screenId,
      { status: ScreenStatus.INACTIVE },
      { new: true }
    );

    if (!screen) {
      throw new NotFoundError('screen not found!');
    }

    res
      .status(200)
      .json({ message: 'Screen deactivated successfully', screen });
  } catch (error) {
    res.status(500).json({ message: 'Failed to deactivate screen', error });
  }
};
export const getScreenByTitle = async (req: Request, res: Response) => {
  try {
    const { title } = req.params;
    if (!title) {
      throw new NotFoundError('screen not found!');
    }
    const screens = await screenModel
      .find({
        title: title,
        status: 'active',
      })
      .populate({
        path: 'ad',
        populate: {
          path: 'product',
        },
      });

    res.status(200).json(screens);
  } catch (error) {
    res.status(500).json({ message: 'Failed to deactivate screen', error });
  }
};

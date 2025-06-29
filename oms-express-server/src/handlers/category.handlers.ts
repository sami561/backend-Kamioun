import { Request, Response } from 'express';
import Category from '../model/category.model';
import fetchAndStoreCategories from '../utils/fetchCategories';

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await Category.countDocuments();

    if (count === 0) {
      console.log('⚠️ No categories in DB. Fetching from API...');
      await fetchAndStoreCategories();
    }

    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories', details: error });
  }
};

export const getCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let category = await Category.findOne({ categoryId: Number(id) });

    if (!category) {
      console.log(`⚠️ Category with ID ${id} not found. Fetching from API...`);
      await fetchAndStoreCategories();
      category = await Category.findOne({ categoryId: Number(id) });

      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching category', details: error });
  }
};

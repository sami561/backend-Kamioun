import { Request, Response } from 'express';
import fetchAndStoreProducts from '../utils/fetchProducts';
import productModel from '../model/product.model';
export const getProduct = async (req: Request, res: Response) => {
  let isFetched = false;
  try {
    const products = await productModel.find();

    if (products.length === 0 && !isFetched) {
      console.log('⚠️ No products in DB. Fetching from API...');
      await fetchAndStoreProducts();
      isFetched = true;
    }

    const storedProducts = await productModel.find();
    res.json(storedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

//For Suppliers
export const getSupplierProducts = async (req: Request, res: Response) => {
  try {
    const count = await productModel.countDocuments();
    
    if (count === 0) {
      console.log('⚠️ No products in DB. Fetching from API...');
      await fetchAndStoreProducts();
    }

    const storedProducts = await productModel.find();
    res.json(storedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};


export const searchProducts = async (req: Request, res: Response) => {
  const { query } = req.query;

  try {
    const products = await productModel.find({
      name: { $regex: query, $options: 'i' },
    }).limit(10);

    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

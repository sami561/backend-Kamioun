import axios from 'axios';
import Category, { ICategory } from '../model/category.model';

const fetchAndStoreCategories = async (): Promise<void> => {
  try {
    const response = await axios.get(
      'https://uat.kamioun.com/rest/default/V1/categories?fields=children_data[id,name]',
      {
        headers: { Authorization: `Bearer pd2as4cqycmj671bga4egknw2csoa9b6` },
      }
    );

    // ✅ Map API response to match MongoDB schema
    const categories: ICategory[] = response.data.children_data.map((category: any) => ({
      categoryId: category.id,
      nameCategory: category.name,
    }));

    if (categories.length === 0) {
      console.log('⚠️ No categories found.');
      return;
    }

    // ✅ Insert/update categories efficiently
    await Category.bulkWrite(
      categories.map((category) => ({
        updateOne: {
          filter: { categoryId: category.categoryId }, // ✅ Corrected field name
          update: { $set: category },
          upsert: true,
        },
      }))
    );

    console.log('✅ Categories stored successfully.');
  } catch (error) {
    console.error('❌ Error fetching/storing categories:', error);
  }
};

export default fetchAndStoreCategories;

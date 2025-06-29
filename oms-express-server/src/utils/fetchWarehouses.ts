import axios from 'axios';
import dotenv from 'dotenv';
import Warehouse from '../model/warehouse.model';

dotenv.config();

const fetchAndStoreWarehouses = async (): Promise<void> => {
  try {
    const response = await axios.get(
      'https://uat.kamioun.com/rest/default/V1/store/storeViews?fields=id,code,website_id,name',
      {
        headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
      }
    );

    if (!Array.isArray(response.data)) {
      console.error('❌ Unexpected API response format:', response.data);
      return;
    }

    const warehouses = response.data.map((w: any) =>
      new Warehouse({
        warehouseId: w.id,
        websiteId: w.website_id,
        code: w.code,
        name: w.name,
      })
    );

    if (warehouses.length === 0) {
      console.log('⚠️ No warehouses found.');
      return;
    }

    await Warehouse.bulkWrite(
      warehouses.map((warehouse) => ({
        updateOne: {
          filter: { warehouseId: warehouse.warehouseId },
          update: { $set: warehouse },
          upsert: true,
        },
      }))
    );

    console.log('✅ Warehouses stored successfully.');
  } catch (error: any) {
    console.error('❌ Error fetching/storing warehouses:', error.message || error);
  }
};

export default fetchAndStoreWarehouses;

import fs from 'fs';
import path from 'path';
import Supplier, { ISupplier } from '../model/supplier.model';

const fetchAndStoreSuppliers = async (): Promise<void> => {
  try {
    // Read the local JSON file (replace 'suppliers.json' with your actual file path)
    const filePath = path.join(__dirname, '../data/suppliers.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');

    // Parse the JSON data
    const data = JSON.parse(fileData);
    const suppliers: ISupplier[] = data.suppliers;

    if (!suppliers || suppliers.length === 0) {
      console.log('⚠️ No suppliers found.');
      return;
    }

    // ✅ Insert/update suppliers efficiently
    await Supplier.bulkWrite(
      suppliers.map((supplier) => ({
        updateOne: {
          filter: { manufacturerId: supplier.manufacturerId },
          update: { $set: supplier },
          upsert: true
        }
      }))
    );

    console.log('✅ Suppliers stored successfully.');
  } catch (error) {
    console.error('❌ Error fetching/storing suppliers:', error);
  }
};

export default fetchAndStoreSuppliers;

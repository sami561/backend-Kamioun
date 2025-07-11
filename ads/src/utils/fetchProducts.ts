import axios from 'axios';
import Product, { IProduct } from '../model/product.model'; 
const fetchAndStoreProducts = async (): Promise<void> => {
  try {
    const response = await axios.get(
      'https://uat.kamioun.com/rest/default/V1/products?searchCriteria[currentPage]=1&searchCriteria[pageSize]=8000&fields=items[id,name,price,sku,extension_attributes,created_at,updated_at,category_links,custom_attributes[attribute_code,value]]',
      {
        headers: { Authorization: `Bearer pd2as4cqycmj671bga4egknw2csoa9b6` },
      }
    );

    const products = response.data.items.map((item: any) => {
      const stock_item = item.extension_attributes?.stock_item || {};

      const category_ids =
        item.extension_attributes?.category_links?.map(
          (cat: any) => cat.category_id
        ) || [];

      const customAttributes = Object.fromEntries(
        (item.custom_attributes || []).map((attr: any) => [
          attr.attribute_code,
          attr.value,
        ])
      );

      return {
        product_id: item.id,
        sku: item.sku,
        name: item.name,
        price: item.price,
        created_at: item.created_at,
        updated_at: item.updated_at,
        website_ids: item.extension_attributes?.website_ids || [],
        category_ids,
        cost: customAttributes.cost
          ? parseFloat(customAttributes.cost)
          : undefined,
        special_price: customAttributes.special_price
          ? parseFloat(customAttributes.special_price)
          : undefined,
        image: customAttributes.image || undefined,
        url_key: customAttributes.url_key || undefined,
        manufacturer: customAttributes.manufacturer || undefined,
        stock_item: {
          item_id: stock_item.item_id,
          product_id: stock_item.product_id,
          stock_id: stock_item.stock_id,
          qty: stock_item.qty,
          is_in_stock: stock_item.is_in_stock,
          min_qty: stock_item.min_qty,
          min_sale_qty: stock_item.min_sale_qty,
          max_sale_qty: stock_item.max_sale_qty,
          backorders: stock_item.backorders,
          low_stock_date: stock_item.low_stock_date,
        },
      };
    });

    if (products.length === 0) {
      console.log('⚠️ No products found.');
      return;
    }

    // ✅ Bulk update/insert
      await Product.bulkWrite(
      products.map((product: IProduct) => ({
        updateOne: {
          filter: { product_id: product.product_id },
          update: { $set: product },
          upsert: true,
        },
      }))
    ); 

    console.log('✅ Products stored successfully.');
  } catch (error) {
    console.error('❌ Error fetching/storing products:', error);
  }
};

export default fetchAndStoreProducts;

import { faker } from '@faker-js/faker';
import Product from '../model/product.model';
import Ads from '../model/ad.model';
import mongoose from 'mongoose';
import { adStatus, adType } from '../types/ad.types';
export async function seedProducts() {
  try {
    console.log('Existing products cleared.');
    const ads = [];
    const products = [];
    for (let i = 0; i < 15; i++) {
      ads.push({
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        imageUrl: ['/wysiwyg/Flouci_Banner.png'],
        adType: faker.helpers.arrayElement(Object.values(adType)),
        clickUrl: 'Cart',
        status: faker.helpers.arrayElement(Object.values(adStatus)),
        startDate: faker.date.future(),
        endDate: faker.date.future(),
        product: new mongoose.Types.ObjectId(),
        screen: 'test',
        position: faker.number.int({ min: 1, max: 2 }),
      });
      products.push({
        id: faker.number.int({ min: 1000, max: 9999 }),
        sku: faker.string.alphanumeric(10),
        name: faker.commerce.productName(),
        price: faker.number.float({ min: 1, max: 1000 }),
        cost: faker.number.float({ min: 1, max: 1000 }),
        special_price: faker.datatype.boolean()
          ? faker.number.float({ min: 1, max: 1000 })
          : undefined,
        image: faker.image.urlLoremFlickr({ category: 'business' }),
        url_key: faker.lorem.slug(),
        manufacturer: faker.company.name(),
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
        website_ids: Array.from({ length: 3 }, () =>
          faker.number.int({ min: 1, max: 10 })
        ),
        category_ids: Array.from({ length: 3 }, () => faker.string.uuid()),
        stock_item: {
          item_id: faker.number.int({ min: 100, max: 999 }),
          product_id: faker.number.int({ min: 1000, max: 9999 }),
          stock_id: faker.number.int({ min: 1, max: 10 }),
          qty: faker.number.int({ min: 0, max: 100 }),
          is_in_stock: faker.datatype.boolean(),
          min_qty: faker.number.int({ min: 0, max: 10 }),
          min_sale_qty: faker.number.int({ min: 1, max: 10 }),
          max_sale_qty: faker.number.int({ min: 10, max: 100 }),
          backorders: faker.number.int({ min: 0, max: 3 }),
          low_stock_date: faker.date.future().toISOString(),
        },
      });
    }

    await Ads.insertMany(ads);
    await Product.insertMany(products);
    console.log('Fake products inserted successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}

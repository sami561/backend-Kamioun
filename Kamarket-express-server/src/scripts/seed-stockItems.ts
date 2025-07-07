import mongoose from "mongoose";
import stockItemModel from "../Model/stockItem.model";
import dotenv from "dotenv";

dotenv.config();

const stockItems = [
  {
    item_id: 1001,
    product_id: 2001,
    stock_id: 3001,
    qty: 150,
    is_in_stock: true,
    min_qty: 10,
    min_sale_qty: 1,
    max_sale_qty: 50,
    backorders: 0,
    low_stock_date: "2024-01-15",
  },
  {
    item_id: 1002,
    product_id: 2002,
    stock_id: 3002,
    qty: 75,
    is_in_stock: true,
    min_qty: 5,
    min_sale_qty: 1,
    max_sale_qty: 25,
    backorders: 0,
    low_stock_date: "2024-01-20",
  },
  {
    item_id: 1003,
    product_id: 2003,
    stock_id: 3003,
    qty: 200,
    is_in_stock: true,
    min_qty: 15,
    min_sale_qty: 1,
    max_sale_qty: 100,
    backorders: 0,
    low_stock_date: "2024-01-10",
  },
  {
    item_id: 1004,
    product_id: 2004,
    stock_id: 3004,
    qty: 25,
    is_in_stock: true,
    min_qty: 5,
    min_sale_qty: 1,
    max_sale_qty: 10,
    backorders: 0,
    low_stock_date: "2024-01-25",
  },
  {
    item_id: 1005,
    product_id: 2005,
    stock_id: 3005,
    qty: 0,
    is_in_stock: false,
    min_qty: 10,
    min_sale_qty: 1,
    max_sale_qty: 20,
    backorders: 15,
    low_stock_date: "2024-01-30",
  },
  {
    item_id: 1006,
    product_id: 2006,
    stock_id: 3006,
    qty: 300,
    is_in_stock: true,
    min_qty: 20,
    min_sale_qty: 1,
    max_sale_qty: 150,
    backorders: 0,
    low_stock_date: "2024-01-05",
  },
  {
    item_id: 1007,
    product_id: 2007,
    stock_id: 3007,
    qty: 50,
    is_in_stock: true,
    min_qty: 8,
    min_sale_qty: 1,
    max_sale_qty: 30,
    backorders: 0,
    low_stock_date: "2024-01-18",
  },
  {
    item_id: 1008,
    product_id: 2008,
    stock_id: 3008,
    qty: 120,
    is_in_stock: true,
    min_qty: 12,
    min_sale_qty: 1,
    max_sale_qty: 60,
    backorders: 0,
    low_stock_date: "2024-01-12",
  },
  {
    item_id: 1009,
    product_id: 2009,
    stock_id: 3009,
    qty: 8,
    is_in_stock: true,
    min_qty: 5,
    min_sale_qty: 1,
    max_sale_qty: 5,
    backorders: 0,
    low_stock_date: "2024-01-28",
  },
  {
    item_id: 1010,
    product_id: 2010,
    stock_id: 3010,
    qty: 0,
    is_in_stock: false,
    min_qty: 15,
    min_sale_qty: 1,
    max_sale_qty: 40,
    backorders: 25,
    low_stock_date: "2024-01-22",
  },
];

const seedStockItems = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://gharbiameni17:ZrpRYDbOZ0GT12mH@cluster0.fbi5l.mongodb.net/kamarket?retryWrites=true&w=majority&appName=Cluster0/kamarket"
    );
    console.log("Connected to MongoDB");

    // Clear existing stock items
    await stockItemModel.deleteMany({});
    console.log("Cleared existing stock items");

    // Insert new stock items
    const insertedStockItems = await stockItemModel.insertMany(stockItems);
    console.log(
      `Successfully inserted ${insertedStockItems.length} stock items`
    );

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding stock items:", error);
    process.exit(1);
  }
};

// Run the seed function
seedStockItems();

import mongoose from "mongoose";
import OrderModel from "../Model/order.modal";
import productModel from "../Model/product.model";
import userModel from "../Model/user.model";
import dotenv from "dotenv";

dotenv.config();

const STATUSES = ["completed", "pending", "processing", "cancelled"];
const STATUS_BIAS = [
  "completed",
  "completed",
  "completed",
  "completed",
  "pending",
  "processing",
  "cancelled",
];

function randomDateThisYear() {
  const start = new Date(new Date().getFullYear(), 0, 1);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function randomStatus() {
  return STATUS_BIAS[Math.floor(Math.random() * STATUS_BIAS.length)];
}

async function getRandomProduct() {
  const products = await productModel.find({});
  if (products.length === 0) throw new Error("No products found");
  return products[Math.floor(Math.random() * products.length)];
}

async function getRandomUser() {
  const users = await userModel.find({});
  if (users.length === 0) throw new Error("No users found");
  return users[Math.floor(Math.random() * users.length)];
}

async function generateOrder() {
  const product = await getRandomProduct();
  const user = await getRandomUser();
  const quantity = Math.floor(Math.random() * 10) + 1;
  const price = product.price;
  const total = price * quantity;
  const status = randomStatus();
  const delivery_date = randomDateThisYear();
  return {
    state: "new",
    status: "completed",
    total,
    customer_id: user._id,
    discount_amount: 0,
    store_id: 1,
    items: [
      {
        product: product._id,
        quantity,
        price,
      },
    ],
    delivery_date,
    delivery_description: "Random delivery description",
  };
}

async function seedOrders() {
  try {
    await mongoose.connect(
      "mongodb+srv://gharbiameni17:ZrpRYDbOZ0GT12mH@cluster0.fbi5l.mongodb.net/kamarket?retryWrites=true&w=majority&appName=Cluster0/kamarket"
    );
    console.log("Connected to MongoDB");

    // Optionally clear existing orders
    console.log("Cleared existing orders");

    const orders = [];
    for (let i = 0; i < 20; i++) {
      orders.push(await generateOrder());
    }

    await OrderModel.insertMany(orders);
    console.log(`Inserted ${orders.length} orders`);
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedOrders();

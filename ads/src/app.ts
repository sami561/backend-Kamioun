import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';

// Import routes
import adRoutes from './routes/ad.routes';
import ScreenRoutes from './routes/Screen.routes';
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
import supplier_products from './routes/supplier_product.routes';
import productStockRoutes from './routes/product_stock.routes';
import orderRoutes from './routes/order.routes';
import warehouseRoutes from './routes/warehouse.routes';
import customerRoutes from './routes/customer.routes';
import supplierRoutes from './routes/supplier.routes';
import authRoutes from './routes/auth.routes';

import { authMiddleware } from './middlewares/auth.middlewares';

import setupSocket from './webSocket';

const app = express();

const server = http.createServer(app);

const io = setupSocket(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

interface Order {
  customerFirstname: string;
  customerLastname: string;
  orderId: string;
  incrementId: string;
  action: string;
  storeId: string;
}

app.post('/api', (req: Request, res: Response) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const order: Order = req.body;
  // Validate required fields
  if (
    !order.customerFirstname ||
    !order.customerLastname ||
    !order.orderId ||
    !order.incrementId ||
    !order.action ||
    !order.storeId
  ) {
    return res
      .status(400)
      .json({ error: 'Missing required fields in request body' });
  }

  const name = `${order.customerFirstname} ${order.customerLastname}`;
  const id = `${order.orderId}-${new Date().getTime()}`;
  const message = `Order #${order.incrementId} is ${order.action}`;
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  const time = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;

  io.emit('notification', {
    name,
    message,
    time,
    id,
    orderId: order.orderId,
    storeId: order.storeId,
  });

  return res.status(200).json({ name, message });
});

app.use('/oms/api/auth', authRoutes);

// Test route
app.get('/oms/test', (_, res) => {
  res.json({ test: true });
});

app.use('/oms/api/ad', adRoutes);
app.use('/oms/api/screen', ScreenRoutes);
app.use('/oms/api/products', productRoutes);

// Protected routes
const protectedRoutes = [
  { path: '/oms/api/warehouses', route: warehouseRoutes },
  { path: '/oms/api/categories', route: categoryRoutes },
  { path: '/oms/api/supplier_products', route: supplier_products },
  { path: '/oms/api/products_stock', route: productStockRoutes },
  { path: '/oms/api/orders', route: orderRoutes },
  { path: '/oms/api/customers', route: customerRoutes },
  { path: '/oms/api/suppliers', route: supplierRoutes },
];

app.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (
    authHeader &&
    !/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(
      authHeader
    )
  ) {
    return res
      .status(400)
      .json({ error: 'Invalid authorization header format' });
  }

  next();
});

protectedRoutes.forEach(({ path, route }) => {
  app.use(path, authMiddleware, route);
});

export { app, server };

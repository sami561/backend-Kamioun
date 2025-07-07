import express, { Application, Request, Response } from "express";
import orderRoutes from "./routes/order.routes";
import productRoutes from "./routes/product.routes";
import AuthRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import supplierRoutes from "./routes/supplier.routes";
import brandRoutes from "./routes/brand.routes";
import userRoutes from "./routes/user.routes";
import cartRoutes from "./routes/cart.routes";
import stockItemRoutes from "./routes/stockItem.routes";
import cors from "cors";
import { errorHandler } from "./middlewares/error-handler.middleware";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  "/kamarket/uploads",
  express.static("uploads", {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // Allow images to be loaded
      res.removeHeader("X-Frame-Options"); // Remove iframe blocking
    },
  })
);

app.use("/kamarket/orders", orderRoutes);
app.use("/kamarket/category", categoryRoutes);
app.use("/kamarket/product", productRoutes);
app.use("/kamarket/auth", AuthRoutes);
app.use("/kamarket/supplier", supplierRoutes);
app.use("/kamarket/brand", brandRoutes);
app.use("/kamarket/user", userRoutes);
app.use("/kamarket/cart", cartRoutes);
app.use("/kamarket/stock-item", stockItemRoutes);
app.get("/kamarket/profile", (req, res) => {
  res.json({
    profile: true,
    user: req.user,
  });
});

app.use(errorHandler);
app.get("/kamarket/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

export default app;

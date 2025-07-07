import { Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request.error";
import { NotFoundError } from "../errors/not-found.error";
import cartModel from "../Model/cart.model";
import productModel from "../Model/product.model";
import { AddToCartDto, UpdateCartItemDto } from "../types/cart.types";
import mongoose from "mongoose";

export const getCart = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    throw new BadRequestError("User not authenticated");
  }

  let cart = await cartModel
    .findOne({ user: userId, status: "active" })
    .populate("items.product");

  if (!cart) {
    cart = await cartModel.create({
      user: userId,
      items: [],
      total: 0,
      status: "active",
    });
  }

  res.status(200).json(cart);
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;
  const { productId, quantity = 1 }: AddToCartDto = req.body;

  if (!userId) {
    throw new BadRequestError("User not authenticated");
  }

  if (!productId) {
    throw new BadRequestError("Product ID is required");
  }

  // Validate productId format
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new BadRequestError("Invalid product ID format");
  }

  const product = await productModel.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  let cart = await cartModel.findOne({ user: userId, status: "active" });

  if (!cart) {
    cart = await cartModel.create({
      user: userId,
      items: [
        {
          product: new mongoose.Types.ObjectId(productId), // Convert to ObjectId
          quantity,
          price: product.price,
        },
      ],
      total: product.price * quantity,
      status: "active",
    });
  } else {
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId), // Convert to ObjectId
        quantity,
        price: product.price,
      });
    }

    // Recalculate total
    cart.total = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
  }

  const populatedCart = await cartModel
    .findById(cart._id)
    .populate("items.product");

  res.status(200).json(populatedCart);
};

export const updateCartItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?._id;
  const { productId } = req.params;
  const { quantity }: UpdateCartItemDto = req.body;

  if (!userId) {
    throw new BadRequestError("User not authenticated");
  }

  if (!quantity || quantity < 1) {
    throw new BadRequestError("Valid quantity is required");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new BadRequestError("Invalid product ID format");
  }

  const cart = await cartModel.findOne({ user: userId, status: "active" });
  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new NotFoundError("Item not found in cart");
  }

  cart.items[itemIndex].quantity = quantity;
  // Recalculate total
  cart.total = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  await cart.save();

  const updatedCart = await cartModel
    .findById(cart._id)
    .populate("items.product");

  res.status(200).json(updatedCart);
};

export const removeFromCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?._id;
  const { productId } = req.params;

  if (!userId) {
    throw new BadRequestError("User not authenticated");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new BadRequestError("Invalid product ID format");
  }

  const cart = await cartModel.findOne({ user: userId, status: "active" });
  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  // Recalculate total
  cart.total = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  await cart.save();

  const updatedCart = await cartModel
    .findById(cart._id)
    .populate("items.product");

  res.status(200).json(updatedCart);
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    throw new BadRequestError("User not authenticated");
  }

  const cart = await cartModel.findOne({ user: userId, status: "active" });
  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  cart.items = [];
  cart.total = 0;
  await cart.save();

  res.status(200).json(cart);
};

export const getCartHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    throw new BadRequestError("User not authenticated");
  }

  const carts = await cartModel
    .find({ user: userId })
    .populate({
      path: "items.product",
      populate: {
        path: "brand categories stock_item",
      },
    })
    .sort({ createdAt: -1 });

  res.status(200).json(carts);
};

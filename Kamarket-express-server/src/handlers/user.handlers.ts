import {
  getCustomers as getCustomersService,
  getAdmins as getAdminsService,
  countCustomers as countCustomersService,
  countAdmins as countAdminsService,
  updateCustomer as updateCustomerService,
} from "../service/users.service";
import { Request, Response } from "express";

export const getCustomers = async (_req: Request, res: Response) => {
  const customers = await getCustomersService();
  res.json(customers);
};

export const getAdmins = async (_req: Request, res: Response) => {
  const admins = await getAdminsService();
  res.json(admins);
};

export const countCustomers = async (_req: Request, res: Response) => {
  const result = await countCustomersService();
  res.json(result);
};

export const countAdmins = async (_req: Request, res: Response) => {
  const result = await countAdminsService();
  res.json(result);
};

export const updateCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?._id;
  const updateData = req.body;

  if (!userId) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  // Handle file upload if present
  if (req.file) {
    updateData.profilePhoto = req.file.filename;
  }

  const updatedCustomer = await updateCustomerService(userId, updateData);
  res.json(updatedCustomer);
};

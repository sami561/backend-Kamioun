import {
  getCustomers as getCustomersService,
  getAdmins as getAdminsService,
  countCustomers as countCustomersService,
  countAdmins as countAdminsService,
  updateCustomer as updateCustomerService,
} from "../service/users.service";
import userModel from "../Model/user.model";
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

export const activateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const user = await userModel.findByIdAndUpdate(
    id,
    { active: true },
    { new: true }
  );
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json({ message: "User activated", user });
};

export const deactivateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const user = await userModel.findByIdAndUpdate(
    id,
    { active: false },
    { new: true }
  );
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json({ message: "User deactivated", user });
};
export const getAccountTypeCounts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const result = await userModel.aggregate([
    {
      $group: {
        _id: "$accountType",
        count: { $sum: 1 },
      },
    },
  ]);
  // Format as { CUSTOMER: 10, ADMIN: 5, ... }
  const counts: Record<string, number> = {};
  result.forEach((r) => {
    counts[r._id] = r.count;
  });
  res.json(counts);
};

import {
  getCustomers as getCustomersService,
  getAdmins as getAdminsService,
  getOperations as getOperationsService,
  getVendors as getVendorsService,
  countCustomers as countCustomersService,
  countAdmins as countAdminsService,
  countOperations as countOperationsService,
  countVendors as countVendorsService,
  updateCustomer as updateCustomerService,
  updateUser as updateUserService,
  getCustomerCountsByAccountType as getCustomerCountsByAccountTypeService,
  getAllUsers as getAllUsersService,
  getUserById as getUserByIdService,
} from "../service/users.service";
import userModel from "../Model/user.model";
import { Request, Response } from "express";

export const getCustomers = async (_req: Request, res: Response) => {
  const customers = await getCustomersService();
  res.json(customers);
};

export const getAdmins = async (_req: Request, res: Response) => {
  console.log("test");
  const admins = await getAdminsService();
  res.json(admins);
};

export const getOperations = async (_req: Request, res: Response) => {
  const operations = await getOperationsService();
  res.json(operations);
};

export const getVendors = async (_req: Request, res: Response) => {
  const vendors = await getVendorsService();
  res.json(vendors);
};

export const countCustomers = async (_req: Request, res: Response) => {
  const result = await countCustomersService();
  res.json(result);
};

export const countAdmins = async (_req: Request, res: Response) => {
  const result = await countAdminsService();
  res.json(result);
};

export const countOperations = async (_req: Request, res: Response) => {
  const result = await countOperationsService();
  res.json(result);
};

export const countVendors = async (_req: Request, res: Response) => {
  const result = await countVendorsService();
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

export const updateUser = async (
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

  try {
    const updatedUser = await updateUserService(userId, updateData);
    res.json(updatedUser);
  } catch (error: any) {
    if (error.message.includes("This endpoint is not for customers")) {
      res.status(403).json({ error: error.message });
    } else if (error.message === "User not found") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Failed to update user" });
    }
  }
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
      $lookup: {
        from: "accounts",
        localField: "account",
        foreignField: "_id",
        as: "accountDetails",
      },
    },
    {
      $unwind: "$accountDetails",
    },
    {
      $group: {
        _id: "$accountDetails.accountType",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Format the result to include all account types with 0 count if no users exist
  const counts: Record<string, number> = {};

  // Initialize all account types with 0
  const accountTypes = ["customer", "admin", "operation"];
  accountTypes.forEach((type) => {
    counts[type] = 0;
  });

  // Update with actual counts
  result.forEach((item) => {
    counts[item._id] = item.count;
  });

  res.json(counts);
};

export const getCustomerCountsByAccountType = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const counts = await getCustomerCountsByAccountTypeService();
    res.json(counts);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get customer counts by account type" });
  }
};

export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await getAllUsersService();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to get all users" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    res.json(user);
  } catch (error: any) {
    if (error.message === "User not found") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Failed to get user" });
    }
  }
};

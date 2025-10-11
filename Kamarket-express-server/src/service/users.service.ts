import { BadRequestError } from "../errors/bad-request.error";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../Model/user.model";
import accountModel from "../Model/account.model";
import { AccountTypes } from "../types/account.types";
import {
  JwtPayload,
  LoginWithEmailDto,
  LoginWithPhoneDto,
  RegisterWithEmailDto,
  RegisterWithPhoneDto,
  UserPayload,
  UpdateCustomerDto,
  ForgotPasswordDto,
} from "../types/users.types";
import { getEnv } from "../utils/env";
import { sendPasswordResetEmail } from "../utils/emailService";

const createJwtPayload = (user: any): JwtPayload => {
  const payload: UserPayload = {
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    city: user.city,
    account: user.account.toString(),
    profilePhoto: user.profilePhoto,
    ...(user.phoneNumber && { phoneNumber: user.phoneNumber }),
  };

  const token = jwt.sign(payload, getEnv("JWT_SECRET"), {
    expiresIn: "30d",
  });

  return { token, payload };
};
const createJwtPayloademail = (user: any): JwtPayload => {
  const payload: UserPayload = {
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    city: user.city,
    account: user.account._id
      ? user.account._id.toString()
      : user.account.toString(),
    profilePhoto: user.profilePhoto,
    ...(user.email && { email: user.email }),
    accountType: user.account.accountType,
  };

  const token = jwt.sign(payload, getEnv("JWT_SECRET"), {
    expiresIn: "30d",
  });

  return { token, payload };
};

const checkUserExists = async (email?: string, phoneNumber?: string) => {
  const query: any = {};
  if (email) query.email = email;
  if (phoneNumber) query.phoneNumber = phoneNumber;

  const exists = await userModel.findOne(query);
  if (exists) {
    throw new BadRequestError("User already exists!");
  }
};

export const registerWithEmail = async (data: RegisterWithEmailDto) => {
  await checkUserExists(data.email);
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const account = await accountModel.create({
    accountType: AccountTypes.ADMIN,
  });

  const user = await userModel.create({
    ...data,
    password: hashedPassword,
    active: true,
    account: account._id,
  });

  return user;
};

export const registerWithPhone = async (data: RegisterWithPhoneDto) => {
  await checkUserExists(undefined, data.phoneNumber);
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const account = await accountModel.create({
    accountType: AccountTypes.CUSTOMER,
  });

  const user = await userModel.create({
    ...data,
    password: hashedPassword,
    active: true,
    account: account._id,
  });

  return user;
};

export const loginWithEmail = async (data: LoginWithEmailDto) => {
  // Populate the account field to access accountType
  const user = await userModel
    .findOne({ email: data.email })
    .populate({ path: "account", select: "accountType" });

  console.log("🚀 ~ loginWithEmail ~ user:", user);
  if (!user) {
    throw new BadRequestError("User not found");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    throw new BadRequestError("Wrong password");
  }

  return createJwtPayloademail(user);
};

export const loginWithPhone = async (data: LoginWithPhoneDto) => {
  const user = await userModel.findOne({ phoneNumber: data.phoneNumber });

  if (!user) {
    throw new BadRequestError("User not found");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    throw new BadRequestError("Wrong password");
  }

  return createJwtPayload(user);
};

export const getCustomers = async () => {
  const customers = await userModel
    .find()
    .populate({
      path: "account",
      match: { accountType: AccountTypes.CUSTOMER },
    })
    .then((users) => users.filter((user) => user.account !== null));

  return customers;
};

export const getAdmins = async () => {
  const admins = await userModel
    .find()
    .populate({
      path: "account",
      match: { accountType: AccountTypes.ADMIN },
    })
    .then((users) => users.filter((user) => user.account !== null));
  console.log("🚀 ~ getAdmins ~ admins:", admins);

  return admins;
};

export const getOperations = async () => {
  const operations = await userModel
    .find()
    .populate({
      path: "account",
      match: { accountType: AccountTypes.OPERATION },
    })
    .then((users) => users.filter((user) => user.account !== null));

  return operations;
};

export const getVendors = async () => {
  const vendors = await userModel
    .find()
    .populate({
      path: "account",
      match: { accountType: AccountTypes.VENDOR },
    })
    .then((users) => users.filter((user) => user.account !== null));

  return vendors;
};

export const countCustomers = async () => {
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
      $match: {
        "accountDetails.accountType": AccountTypes.CUSTOMER,
      },
    },
    {
      $count: "total",
    },
  ]);

  return { count: result[0]?.total || 0 };
};

export const countAdmins = async () => {
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
      $match: {
        "accountDetails.accountType": AccountTypes.ADMIN,
      },
    },
    {
      $count: "total",
    },
  ]);

  return { count: result[0]?.total || 0 };
};

export const countOperations = async () => {
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
      $match: {
        "accountDetails.accountType": AccountTypes.OPERATION,
      },
    },
    {
      $count: "total",
    },
  ]);

  return { count: result[0]?.total || 0 };
};

export const countVendors = async () => {
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
      $match: {
        "accountDetails.accountType": AccountTypes.VENDOR,
      },
    },
    {
      $count: "total",
    },
  ]);

  return { count: result[0]?.total || 0 };
};

export const getCustomerCountsByAccountType = async () => {
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
  Object.values(AccountTypes).forEach((type) => {
    counts[type] = 0;
  });

  // Update with actual counts
  result.forEach((item) => {
    counts[item._id] = item.count;
  });

  return counts;
};

export const getAllUsers = async () => {
  const users = await userModel
    .find()
    .populate({
      path: "account",
      select: "accountType active",
    })
    .select("-password") // Exclude password from the response
    .sort({ createdAt: -1 }); // Sort by creation date, newest first

  return users;
};

export const getUserById = async (userId: string) => {
  const user = await userModel
    .findById(userId)
    .populate({
      path: "account",
      select: "accountType active",
    })
    .select("-password"); // Exclude password from the response

  if (!user) {
    throw new BadRequestError("User not found");
  }

  return user;
};

export const updateCustomer = async (
  customerId: string,
  data: UpdateCustomerDto
) => {
  const customer = await userModel.findById(customerId);

  if (!customer) {
    throw new BadRequestError("Customer not found");
  }

  // Verify this is actually a customer
  const account = await accountModel.findById(customer.account);
  if (!account || account.accountType !== AccountTypes.CUSTOMER) {
    throw new BadRequestError("User is not a customer");
  }

  const updatedCustomer = await userModel.findByIdAndUpdate(
    customerId,
    { ...data },
    { new: true, runValidators: true }
  );

  return updatedCustomer;
};

export const updateUser = async (userId: string, data: UpdateCustomerDto) => {
  const user = await userModel.findById(userId);

  if (!user) {
    throw new BadRequestError("User not found");
  }

  // Verify this is not a customer (admin or operation)
  const account = await accountModel.findById(user.account);
  if (!account || account.accountType === AccountTypes.CUSTOMER) {
    throw new BadRequestError(
      "This endpoint is not for customers. Use /updateProfile for customers."
    );
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    { ...data },
    { new: true, runValidators: true }
  );

  return updatedUser;
};

export const forgotPassword = async (data: ForgotPasswordDto) => {
  const user = await userModel.findOne({ email: data.email });

  if (!user) {
    throw new BadRequestError("User not found with this email");
  }

  // Generate a new random password
  const newPassword = Math.random().toString(36).slice(-8); // 8 character random password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user's password
  await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });

  // Send email with new password
  await sendPasswordResetEmail(data.email, newPassword);

  return { message: "Password reset email sent successfully" };
};

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
} from "../types/users.types";
import { getEnv } from "../utils/env";

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
    account: user.account.toString(),
    profilePhoto: user.profilePhoto,
    ...(user.email && { email: user.email }),
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
  const user = await userModel.findOne({ email: data.email });

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

  return admins;
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

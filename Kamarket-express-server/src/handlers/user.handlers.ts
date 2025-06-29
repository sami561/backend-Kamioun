import {
  getCustomers as getCustomersService,
  getAdmins as getAdminsService,
  countCustomers as countCustomersService,
  countAdmins as countAdminsService,
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

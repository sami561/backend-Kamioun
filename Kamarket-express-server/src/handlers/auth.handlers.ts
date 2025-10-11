import { Request, Response } from "express";
import {
  registerWithEmail as registerWithEmailService,
  registerWithPhone as registerWithPhoneService,
  loginWithEmail as loginWithEmailService,
  loginWithPhone as loginWithPhoneService,
  forgotPassword as forgotPasswordService,
} from "../service/users.service";

export const registerWithEmail = async (req: Request, res: Response) => {
  const user = await registerWithEmailService(req.body);
  res.json(user);
};

export const registerWithPhone = async (req: Request, res: Response) => {
  const user = await registerWithPhoneService(req.body);
  res.json(user);
};

export const loginWithEmail = async (req: Request, res: Response) => {
  const jwtPayload = await loginWithEmailService(req.body);
  res.json(jwtPayload);
};

export const loginWithPhone = async (req: Request, res: Response) => {
  const jwtPayload = await loginWithPhoneService(req.body);
  res.json(jwtPayload);
};

export const forgotPassword = async (req: Request, res: Response) => {
  const result = await forgotPasswordService(req.body);
  res.json(result);
};

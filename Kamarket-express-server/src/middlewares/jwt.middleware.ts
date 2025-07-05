import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getEnv } from "../utils/env";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { userPayload } from "../types/users.types";

const jwtMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("🚀 ~ token:", token);
  if (!token) {
    throw new UnauthorizedError();
  }
  const decoded = jwt.verify(token, getEnv("JWT_SECRET"));
  console.log("🚀 ~ decoded:", decoded);

  req.user = userPayload.parse(decoded);

  next();
};

export default jwtMiddleware;

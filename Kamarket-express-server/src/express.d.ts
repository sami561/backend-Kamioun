import { UserPayload } from "./types/users.types";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};

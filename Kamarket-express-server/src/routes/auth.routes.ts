import { Router } from "express";
import {
  registerWithEmail,
  registerWithPhone,
  loginWithEmail,
  loginWithPhone,
} from "../handlers/auth.handlers";
import validationMiddleware from "../middlewares/validation.middleware";
import {
  loginWithEmailRequestSchema,
  loginWithPhoneRequestSchema,
  registerWithEmailRequestSchema,
  registerWithPhoneRequestSchema,
} from "../types/users.types";

const router = Router();

router.post(
  "/register/email",
  validationMiddleware(registerWithEmailRequestSchema),
  registerWithEmail
);

router.post(
  "/register/phone",
  validationMiddleware(registerWithPhoneRequestSchema),
  registerWithPhone
);

router.post(
  "/login/email",
  validationMiddleware(loginWithEmailRequestSchema),
  loginWithEmail
);

router.post(
  "/login/phone",
  validationMiddleware(loginWithPhoneRequestSchema),
  loginWithPhone
);

export default router;

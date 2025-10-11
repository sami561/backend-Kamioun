import { Router } from "express";
import {
  registerWithEmail,
  registerWithPhone,
  loginWithEmail,
  loginWithPhone,
  forgotPassword,
} from "../handlers/auth.handlers";
import validationMiddleware from "../middlewares/validation.middleware";
import {
  loginWithEmailRequestSchema,
  loginWithPhoneRequestSchema,
  registerWithEmailRequestSchema,
  registerWithPhoneRequestSchema,
  forgotPasswordRequestSchema,
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

router.post(
  "/forgot-password",
  validationMiddleware(forgotPasswordRequestSchema),
  forgotPassword
);

export default router;

import { Router } from "express";
import {
  getCustomers,
  getAdmins,
  countCustomers,
  countAdmins,
  updateCustomer,
  activateUser,
  deactivateUser,
  getAccountTypeCounts,
} from "../handlers/user.handlers";
import jwtMiddleware from "../middlewares/jwt.middleware";
import { uploadMiddleware } from "../middlewares/file-upload.middleware";

const router = Router();
router.get("/account-type-counts", jwtMiddleware, getAccountTypeCounts);
// All routes require JWT authentication
router.get("/customers", jwtMiddleware, getCustomers);
router.get("/admins", jwtMiddleware, getAdmins);
router.get("/customers/count", jwtMiddleware, countCustomers);
router.get("/admins/count", jwtMiddleware, countAdmins);
router.put(
  "/updateProfile",
  jwtMiddleware,
  uploadMiddleware.single("profilePhoto"),
  updateCustomer
);
router.post("/:id/activate", jwtMiddleware, activateUser);
router.post("/:id/deactivate", jwtMiddleware, deactivateUser);

export default router;

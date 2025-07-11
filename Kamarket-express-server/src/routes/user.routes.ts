import { Router } from "express";
import {
  getCustomers,
  getAdmins,
  getOperations,
  getVendors,
  countCustomers,
  countAdmins,
  countOperations,
  countVendors,
  updateCustomer,
  updateUser,
  activateUser,
  deactivateUser,
  getAccountTypeCounts,
  getCustomerCountsByAccountType,
  getAllUsers,
  getUserById,
} from "../handlers/user.handlers";
import jwtMiddleware from "../middlewares/jwt.middleware";
import { uploadMiddleware } from "../middlewares/file-upload.middleware";

const router = Router();
router.get("/account-type-counts", jwtMiddleware, getAccountTypeCounts);
router.get(
  "/customer-counts-by-account-type",
  jwtMiddleware,
  getCustomerCountsByAccountType
);
// All routes require JWT authentication
router.get("/", jwtMiddleware, getAllUsers);
router.get("/:id", jwtMiddleware, getUserById);
router.get("/customers", jwtMiddleware, getCustomers);
router.get("/admins/all", jwtMiddleware, getAdmins);
router.get("/operations/all", jwtMiddleware, getOperations);
router.get("/vendors/all", jwtMiddleware, getVendors);
router.get("/customers/count", jwtMiddleware, countCustomers);
router.get("/admins/count", jwtMiddleware, countAdmins);
router.get("/operations/count", jwtMiddleware, countOperations);
router.get("/vendors/count", jwtMiddleware, countVendors);
router.put(
  "/updateProfile",
  jwtMiddleware,
  uploadMiddleware.single("profilePhoto"),
  updateCustomer
);
router.put(
  "/updateUser",
  jwtMiddleware,
  uploadMiddleware.single("profilePhoto"),
  updateUser
);
router.post("/:id/activate", jwtMiddleware, activateUser);
router.post("/:id/deactivate", jwtMiddleware, deactivateUser);

export default router;

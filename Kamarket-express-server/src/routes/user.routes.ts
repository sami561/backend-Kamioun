import { Router } from "express";
import {
  getCustomers,
  getAdmins,
  countCustomers,
  countAdmins,
} from "../handlers/user.handlers";

const router = Router();

router.get("/customers", getCustomers);
router.get("/admins", getAdmins);
router.get("/customers/count", countCustomers);
router.get("/admins/count", countAdmins);

export default router;

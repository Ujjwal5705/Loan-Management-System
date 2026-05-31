import { Router } from "express";
import {
  getSanctionedLoans,
  disburseLoan,
} from "../controllers/disbursement.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate, authorize(["DISBURSEMENT", "ADMIN"]));

router.get("/pending", getSanctionedLoans);
router.patch("/:id/disburse", disburseLoan);

export default router;
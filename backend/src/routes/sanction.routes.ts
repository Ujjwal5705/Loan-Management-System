import { Router } from "express";

import {
  getAppliedLoans,
  approveLoan,
  rejectLoan,
} from "../controllers/sanction.controller";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  authorize,
} from "../middleware/role.middleware";

const router = Router();

router.get(
  "/pending",
  authenticate,
  authorize([
    "SANCTION",
    "ADMIN",
  ]),
  getAppliedLoans
);

router.patch(
  "/:id/approve",
  authenticate,
  authorize([
    "SANCTION",
    "ADMIN",
  ]),
  approveLoan
);

router.patch(
  "/:id/reject",
  authenticate,
  authorize([
    "SANCTION",
    "ADMIN",
  ]),
  rejectLoan
);

export default router;
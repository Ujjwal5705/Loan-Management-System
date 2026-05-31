import { Router } from "express";

import {
  applyLoan,
  getMyLoans,
  calculatePreview,
} from "../controllers/loan.controller";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  authorize,
} from "../middleware/role.middleware";

const router = Router();

router.post(
  "/preview",
  authenticate,
  authorize([
    "BORROWER",
  ]),
  calculatePreview
);

router.post(
  "/apply",
  authenticate,
  authorize([
    "BORROWER",
  ]),
  applyLoan
);

router.get(
  "/my-loans",
  authenticate,
  authorize([
    "BORROWER",
  ]),
  getMyLoans
);

export default router;
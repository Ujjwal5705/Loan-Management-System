import { Router } from "express";

import { createProfile } from "../controllers/borrower.controller";

import { upload } from "../config/multer";

import {
  uploadSalarySlip,
} from "../controllers/borrower.controller";

import {
  authenticate,
} from "../middleware/auth.middleware";

import {
  authorize,
} from "../middleware/role.middleware";

const router = Router();

router.post(
  "/upload-slip",
  authenticate,
  authorize([
    "BORROWER",
  ]),
  upload.single(
    "salarySlip"
  ),
  uploadSalarySlip
);

router.post(
  "/profile",
  authenticate,
  authorize([
    "BORROWER",
  ]),
  createProfile
);

export default router;
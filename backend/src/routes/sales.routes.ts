import { Router } from "express";

import { getLeads } from "../controllers/sales.controller";

import { authenticate } from "../middleware/auth.middleware";

import { authorize } from "../middleware/role.middleware";

const router = Router();

router.get("/leads", authenticate, authorize(["SALES", "ADMIN"]), getLeads);

export default router;

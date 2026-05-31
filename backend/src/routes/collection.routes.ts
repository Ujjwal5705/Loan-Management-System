import { Router } from "express";
import { recordPayment } from "../controllers/collection.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate, authorize(["COLLECTION", "ADMIN"]));

router.post("/repayment", recordPayment);

export default router;
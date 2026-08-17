import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.get(
    "/summary",
    getDashboard
);

export default router;
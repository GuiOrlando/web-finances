import { Router } from "express";
import { register } from "../controllers/authController.js";
import { validateBody } from "../middlewares/validate.js";
import { authRateLimiter } from "../middlewares/authRateLimiter.js";
import { registerSchema } from "../validators/authSchema.js";

const router = Router();

router.post(
    "/register",
    authRateLimiter,
    validateBody(registerSchema),
    register
);

export default router;
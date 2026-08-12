import { Router } from "express";
import { login, register, } from "../controllers/authController.js";
import { validateBody } from "../middlewares/validate.js";
import { authRateLimiter } from "../middlewares/authRateLimiter.js";
import { loginSchema, registerSchema, } from "../validators/authSchema.js";

const router = Router();

router.post(
    "/register",
    authRateLimiter,
    validateBody(registerSchema),
    register
);

router.post(
    "/login",
    authRateLimiter,
    validateBody(loginSchema),
    login
);

export default router;
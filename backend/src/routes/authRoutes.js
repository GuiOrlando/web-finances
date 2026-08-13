import { Router } from "express";
import { login, logout, me, register } from "../controllers/authController.js";
import { validateBody } from "../middlewares/validate.js";
import { authRateLimiter } from "../middlewares/authRateLimiter.js";
import { loginSchema, registerSchema, } from "../validators/authSchema.js";
import { requireAuth } from "../middlewares/requireAuth.js";

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

router.get(
    "/me",
    requireAuth,
    me
);

router.post(
    "/logout",
    logout
);

export default router;
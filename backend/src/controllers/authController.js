import { loginUser, registerUser, } from "../services/authService.js";

import { authConfig } from "../config/auth.js";
import { env } from "../config/env.js";

export async function register(req, res) {
    const user = await registerUser(
        req.validatedBody
    );

    return res.status(201).json({
        data: {
        user,
        },
    });
}

export async function login(req, res) {
    const {
        user,
        session,
    } = await loginUser(
        req.validatedBody
    );

    res.cookie(
        authConfig.sessionCookieName,
        session.token,
        {
        httpOnly: true,

        secure:
            env.nodeEnv === "production",

        sameSite: "lax",

        maxAge: session.maxAge,

        path: "/",
        }
    );

    res.set(
        "Cache-Control",
        "no-store"
    );

    return res.status(200).json({
        data: {
        user,
        },
    });
}
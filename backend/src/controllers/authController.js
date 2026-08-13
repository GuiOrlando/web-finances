import { loginUser, registerUser, } from "../services/authService.js";
import { revokeUserSession, revokeAllUserSessions } from "../services/sessionService.js";
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

export async function me(req, res) {
    res.set(
        "Cache-Control",
        "no-store"
    );

    return res.status(200).json({
        data: {
            user: req.auth.user,
        },
    });
}

export async function logout(req, res) {
    const token = req.cookies?.[
        authConfig.sessionCookieName
    ];

    if (token) {
        await revokeUserSession(token);
    }

    res.clearCookie(
        authConfig.sessionCookieName,
        {
            httpOnly: true,

            secure:
                env.nodeEnv === "production",

            sameSite: "lax",

            path: "/",
        }
    );

    res.set(
        "Cache-Control",
        "no-store"
    );

    return res.status(204).send();
}

export async function logoutAll(req, res) {
    await revokeAllUserSessions(
        req.auth.user.id
    );

    res.clearCookie(
        authConfig.sessionCookieName,
        {
            httpOnly: true,

            secure:
                env.nodeEnv === "production",

            sameSite: "lax",

            path: "/",
        }
    );

    res.set(
        "Cache-Control",
        "no-store"
    );

    return res.status(204).send();
}
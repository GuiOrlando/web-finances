import { authConfig } from "../config/auth.js";
import { AppError } from "../errors/AppError.js";
import { getAuthenticatedSession } from "../services/sessionService.js";

export async function requireAuth(req, res, next) {
    const token = req.cookies?.[
        authConfig.sessionCookieName
    ];

    if (!token) {
        throw new AppError(
            "Autenticação necessária.",
            401,
            "AUTHENTICATION_REQUIRED"
        );
    }

    const authentication =
        await getAuthenticatedSession(token);

    if (!authentication) {
        throw new AppError(
            "Sessão inválida ou expirada.",
            401,
            "INVALID_SESSION"
        );
    }

    req.auth = authentication;
    next();
}
import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";

const SAFE_METHODS = new Set([
    "GET",
    "HEAD",
    "OPTIONS",
]);

export function csrfProtection(req, res, next) {
    if (SAFE_METHODS.has(req.method)) {
        return next();
    }

    const fetchSite = req.get("Sec-Fetch-Site");

    if (fetchSite === "cross-site") {
        throw new AppError(
        "Requisição não permitida.",
        403,
        "CSRF_BLOCKED"
        );
    }

    const origin = req.get("Origin");

    if (
        origin &&
        origin !== env.frontendOrigin
    ) {
        throw new AppError(
        "Origem não permitida.",
        403,
        "CSRF_BLOCKED"
        );
    }

    const csrfHeader = req.get(
        "X-CSRF-Protection"
    );

    if (csrfHeader !== "1") {
        throw new AppError(
        "Proteção CSRF ausente.",
        403,
        "CSRF_PROTECTION_REQUIRED"
        );
    }

    return next();
}
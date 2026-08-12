import { createHash, randomBytes, } from "node:crypto";

import { authConfig } from "../config/auth.js";
import { createSession } from "../repositories/sessionRepository.js";

function hashSessionToken(token) {
    return createHash("sha256")
        .update(token)
        .digest("hex");
}

function formatDateForMySQL(date) {
    return date
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
}

export async function createUserSession(usuarioId) {
    const token = randomBytes(
        authConfig.sessionTokenBytes
    ).toString("base64url");

    const tokenHash = hashSessionToken(token);

    const expiresAt = new Date(
        Date.now() + authConfig.sessionTtlMs
    );

    await createSession({
        usuarioId,
        tokenHash,
        expiraEm: formatDateForMySQL(expiresAt),
    });

    return {
        token,
        maxAge: authConfig.sessionTtlMs,
    };
}
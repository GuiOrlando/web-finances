import { createHash, randomBytes, } from "node:crypto";

import { authConfig } from "../config/auth.js";
import { createSession, findActiveSessionByTokenHash, revokeSessionByTokenHash } from "../repositories/sessionRepository.js";

export function hashSessionToken(token) {
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

function isValidSessionToken(token) {
    return (
        typeof token === "string" &&
        /^[A-Za-z0-9_-]{43}$/.test(token)
    );
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

export async function getAuthenticatedSession(token) {
    if (!isValidSessionToken(token)) {
        return null;
    }

    const tokenHash = hashSessionToken(token);
    const session =
        await findActiveSessionByTokenHash(tokenHash);

    if (!session) {
        return null;
    }

    return {
        sessionId: session.sessao_id,

        user: {
            id: session.usuario_id,
            nome: session.nome,
            email: session.emailm
        },
    };
}

export async function revokeUserSession(token) {
    if (!isValidSessionToken(token)) {
        return false;
    }

    const tokenHash = hashSessionToken(token);

    return revokeSessionByTokenHash(tokenHash);
}
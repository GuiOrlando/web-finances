import { createHash, randomBytes, } from "node:crypto";

import { authConfig } from "../config/auth.js";
import {
    cleanupOldSessions,
    createSession,
    findActiveSessionByTokenHash,
    revokeAllSessionsByUserId,
    revokeSessionByTokenHash,
    touchSession,
} from "../repositories/sessionRepository.js";

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

    await createSession({
        usuarioId,
        tokenHash,
        ttlSeconds:
            authConfig.sessionTtlSeconds,
    });

    return {
        token,
        maxAge:
            authConfig.sessionTtlMs,
    };
}

export async function getAuthenticatedSession(token) {
    if (!isValidSessionToken(token)) {
        return null;
    }

    const tokenHash = hashSessionToken(token);
    const session =
        await findActiveSessionByTokenHash(
            tokenHash,
            authConfig
                .sessionIdleTimeoutMinutes
        );

    if (!session) {
        return null;
    }

    await touchSession(
        session.sessao_id
    );

    return {
        sessionId:
            session.sessao_id,

        user: {
            id: session.usuario_id,
            nome: session.nome,
            email: session.email,
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

export async function revokeAllUserSessions(usuarioId) {
    return revokeAllSessionsByUserId(usuarioId);
}

export async function cleanupSessions() {
    return cleanupOldSessions();
}
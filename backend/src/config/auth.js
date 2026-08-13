const SESSION_TTL_MS =
    8 * 60 * 60 * 1000;

export const authConfig = Object.freeze({
    sessionCookieName:
        "web_finances_session",

    sessionTtlMs:
        SESSION_TTL_MS,

    sessionTtlSeconds:
        Math.floor(
            SESSION_TTL_MS / 1000
        ),

    sessionIdleTimeoutMinutes:
        30,

    sessionTokenBytes:
        32,
});
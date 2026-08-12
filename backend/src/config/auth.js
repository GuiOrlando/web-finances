export const authConfig = Object.freeze({
    sessionCookieName: "web_finances_session",

    sessionTtlMs:
        7 * 24 * 60 * 60 * 1000,

    sessionTokenBytes: 32,
});
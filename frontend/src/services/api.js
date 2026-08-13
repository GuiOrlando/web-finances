const API_URL =
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3333";

const SAFE_METHODS = new Set([
    "GET",
    "HEAD",
    "OPTIONS",
]);

export async function apiFetch(path, options={}) {
    const method = (
        options.method ?? "GET"
    ).toUpperCase();

    const headers =
        new Headers(options.headers);

    if (options.body && !headers.has("Content-Type")) {
        headers.set(
            "Content-Type",
            "application/json",
        );
    }

    if (!SAFE_METHODS.has(method)) {
        headers.set(
            "X-CSRF-Protection",
            "1"
        );
    }

    const response = await fetch(
        `${API_URL}${path}`,
        {
            ...options,
            method,
            headers,

            credentials: "include",

            cache: "no-store",
        }
    );

    let body = null;

    if (response.status !== 204) {
        const contentType =
            response.headers.get(
                "content-type"
            ) ?? "";

        body = contentType.includes(
            "application/json"
        )
            ? await response.json()
            : await response.text();
    }

    if (!response.ok) {
        const error = new Error(
            body?.error?.message ??
                "Erro na requisição."
        );

        error.code =
            body?.error?.code;

        error.status =
            response.status;

        throw error;
    }

    return body;
}
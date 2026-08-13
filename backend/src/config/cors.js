import { env } from "./env.js";

export const corsOptions = {
    origin: env.frontendOrigin,

    credentials: true,

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],

    allowedHeaders: [
        "Content-Type",
        "X-CSRF-Protection",
    ],
};
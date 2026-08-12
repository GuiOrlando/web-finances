const requiredVariables = [
    "DB_HOST",
    "DB_PORT",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
];

for (const variable of requiredVariables) {
    if (!process.env[variable]) {
        throw new Error(
            `Variável de ambiente obrigatória não definida: ${variable}`
        );
    }
}

const port = Number(process.env.PORT ?? 3333);
const dbPort = Number(process.env.DB_PORT);

if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT deve ser um número inteiro válido.");
}

if (!Number.isInteger(dbPort) || dbPort <= 0) {
    throw new Error("DB_PORT deve ser um número inteiro válido.");
}

export const env = Object.freeze({
    nodeEnv: process.env.NODE_ENV ?? "development",

    port,

    database: {
        host: process.env.DB_HOST,
        port: dbPort,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
    },
});
import app from "./app.js";
import { env } from "./config/env.js";
import { pool, testDatabaseConnection } from "./config/database.js";

let server;

async function startServer() {
    try {
        await testDatabaseConnection();

        console.log("MySQL Conectado.");

        server = app.listen(env.port, () => {
            console.log(
                `API disponível em http://localhost:${env.port}`
            );
        });
    } catch (error) {
        console.error(
            "Erro ao iniciar a aplicação:",
            error.message
        );

        await pool.end();
        process.exit(1);
    }
}

async function shutdown(signal) {
    console.log(
        `${signal} recebido. Encerrando servidor...`
    );

    try {
        if (server) {
            await new Promise((resolve, reject) => {
                server.close((error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                });
            });
        }

        await pool.end();
        console.log("Servidor encerrado.");
        process.exit(0);
    } catch (error) {
        console.error(
            "Erro ao encerrar servidor:",
            error.message
        );

        process.exit(1);
    }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
import { checkDatabaseConnection } from "../repositories/healthRepository.js";
import { AppError } from "../errors/AppError.js";

export async function getHealthStatus() {
    try {
        const databaseConnected =
            await checkDatabaseConnection();

        if (!databaseConnected) {
            throw new Error("Database health check failed.");
        }

        return {
            status: "ok",
            database: "connected",
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        throw new AppError(
            "Banco de dados indisponível.",
            503,
            "DATABASE_UNAVAILABLE",
            {
                cause: error,
            }
        );
    }
}
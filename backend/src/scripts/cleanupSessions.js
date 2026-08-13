import { pool } from "../config/database.js";
import { cleanupSessions } from "../services/sessionService.js";

async function run() {
    try {
        const removed =
            await cleanupSessions();

        console.log(
            `Sessões removidas: ${removed}`
        );
    } catch (error) {
        console.error(
            "Erro ao limpar sessões:",
            error.message
        );

        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

run();
import { pool } from "../config/database.js";

export async function checkDatabaseConnection() {
    const [rows] = await pool.query(
        "SELECT 1 AS connected"
    );

    return rows[0]?.connected === 1;
}
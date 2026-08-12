import mysql from "mysql2/promise";
import { env } from "./env.js";

export const pool = mysql.createPool({
    host: env.database.host,
    port: env.database.port,
    user: env.database.user,
    password: env.database.password,
    database: env.database.name,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function testDatabaseConnection() {
    await pool.query("SELECT 1");
}
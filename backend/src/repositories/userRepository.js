import { pool } from "../config/database.js";

export async function findUserByEmail(email) {
    const [rows] = await pool.execute(
        `
            SELECT
                id,
                nome,
                email,
                senha_hash,
                ativo
            FROM usuarios
            WHERE email = ?
            LIMIT 1
        `,
        [email]
    );

    return rows[0] ?? null
}

export async function createUser({
    nome,
    email,
    senhaHash,
}) {
    const [result] = await pool.execute(
        `
            INSERT INTO usuarios (
                nome,
                email,
                senha_hash
            )
            VALUES (?, ?, ?) 
        `,
        [nome, email, senhaHash]
    );

    return {
        id: result.insertId,
        nome,
        email,
    };
}
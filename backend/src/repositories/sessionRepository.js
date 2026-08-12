import { pool } from "../config/database.js";

export async function createSession({
    usuarioId,
    tokenHash,
    expiraEm,
}) {
    const [result] = await pool.execute(
        `
         INSERT INTO sessoes (
         usuario_id,
         token_hash,
         expira_em
        )
        VALUES (?, ?, ?)
        `,
        [
         usuarioId,
         tokenHash,
         expiraEm,
        ]
    );

    return {
        id: result.insertId,
    };
}
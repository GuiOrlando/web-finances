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

export async function findActiveSessionByTokenHash(tokenHash) {
    const [rows] = await pool.execute(
        `
         SELECT
            s.id AS sessao_id,
            s.usuario_id,
            s.expira_em,

            u.id AS usuario_id,
            u.nome,
            u.email,
            u.ativo

         FROM sessoes AS s

         INNER JOIN usuarios AS u
            ON u.id = s.usuario_id
        
         WHERE s.token_hash = ?
            AND s.revogado_em IS NULL
            AND s.expira_em > CURRENT_TIMESTAMP
            AND u.ativo = 1

         LIMIT 1
        `,
        [tokenHash]
    );

    return rows[0] ?? null;
}

export async function revokeSessionByTokenHash(tokenHash) {
    const [result] = await pool.execute(
        `
         UPDATE sessoes
         SET revogado_em = CURRENT_TIMESTAMP
         WHERE token_hash = ?
            AND revogado_em IS NULL
        `,
        [tokenHash]
    );

    return result.affectedRows > 0;
}
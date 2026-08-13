import { pool } from "../config/database.js";

export async function createSession({
    usuarioId,
    tokenHash,
    ttlSeconds,
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO sessoes (
            usuario_id,
            token_hash,
            expira_em
        )
        VALUES (
            ?,
            ?,
            TIMESTAMPADD(
                SECOND,
                ?,
                CURRENT_TIMESTAMP
            )
        )
        `,
        [
        usuarioId,
        tokenHash,
        ttlSeconds,
        ]
    );

    return {
        id: result.insertId,
    };
}

export async function findActiveSessionByTokenHash(
    tokenHash,
    idleTimeoutMinutes
) {
    const [rows] = await pool.execute(
        `
        SELECT
            s.id AS sessao_id,
            s.usuario_id,
            s.expira_em,
            s.ultimo_acesso_em,

            u.nome,
            u.email

        FROM sessoes AS s

        INNER JOIN usuarios AS u
            ON u.id = s.usuario_id

        WHERE s.token_hash = ?
            AND s.revogado_em IS NULL
            AND s.expira_em > CURRENT_TIMESTAMP
            AND COALESCE(
            s.ultimo_acesso_em,
            s.criado_em
            ) > TIMESTAMPADD(
            MINUTE,
            ?,
            CURRENT_TIMESTAMP
            )
            AND u.ativo = 1

        LIMIT 1
        `,
        [
        tokenHash,
        -idleTimeoutMinutes,
        ]
    );

    return rows[0] ?? null;
}

export async function touchSession(
    sessionId
) {
    await pool.execute(
        `
        UPDATE sessoes
        SET ultimo_acesso_em =
            CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [sessionId]
    );
}

export async function revokeSessionByTokenHash(
    tokenHash
) {
    const [result] = await pool.execute(
        `
        UPDATE sessoes
        SET revogado_em =
            CURRENT_TIMESTAMP

        WHERE token_hash = ?
            AND revogado_em IS NULL
        `,
        [tokenHash]
    );

    return result.affectedRows > 0;
}

export async function revokeAllSessionsByUserId(
    usuarioId
) {
    const [result] = await pool.execute(
        `
        UPDATE sessoes

        SET revogado_em =
            CURRENT_TIMESTAMP

        WHERE usuario_id = ?
            AND revogado_em IS NULL
        `,
        [usuarioId]
    );

    return result.affectedRows;
}

export async function cleanupOldSessions() {
    const [result] = await pool.execute(
        `
        DELETE FROM sessoes

        WHERE
            expira_em <=
            TIMESTAMPADD(
                DAY,
                -7,
                CURRENT_TIMESTAMP
            )

            OR

            revogado_em <=
            TIMESTAMPADD(
                DAY,
                -7,
                CURRENT_TIMESTAMP
            )
        `
    );

    return result.affectedRows;
}
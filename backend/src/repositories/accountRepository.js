import { pool } from "../config/database.js";

export async function findAccountsByUserId(usuarioId) {
    const [rows] = await pool.execute(
        `
         SELECT
            c.id,
            c.nome,
            c.tipo,
            c.saldo_inicial AS saldoInicial,

            (
                c.saldo_inicial
                +
                COALESCE(
                    movimentos.totalMovimentado,
                    0
                )
            ) AS saldoAtual

         FROM contas c

         LEFT JOIN (
            SELECT
                conta_id,

                SUM(
                    CASE
                        WHEN tipo = 'receita'
                            THEN valor

                        WHEN tipo = 'despesa'
                            THEN -valor

                        ELSE 0
                    END
                ) AS totalMovimentado

            FROM transacoes

            WHERE usuario_id = ?
                AND excluido_em IS NULL
                AND data_transacao <= CURRENT_DATE
                AND tipo IN (
                    'receita',
                    'despesa'
                )

            GROUP BY conta_id
         ) movimentos
            ON movimentos.conta_id = c.id

         WHERE c.usuario_id = ?
            AND c.ativo = 1

         ORDER BY c.criado_em DESC
        `,
        [
            usuarioId,
            usuarioId,
        ]
    );

    return rows;
}

export async function findAccountByIdAndUserId(id, usuarioId) {
    const [rows] = await pool.execute(
        `
         SELECT
            c.id,
            c.nome,
            c.tipo,
            c.saldo_inicial AS saldoInicial,

            (
                c.saldo_inicial
                +
                COALESCE(
                    movimentos.totalMovimentado,
                    0
                )
            ) AS saldoAtual

         FROM contas c

         LEFT JOIN (
            SELECT
                conta_id,

                SUM(
                    CASE
                        WHEN tipo = 'receita'
                            THEN valor

                        WHEN tipo = 'despesa'
                            THEN -valor

                        ELSE 0
                    END
                ) AS totalMovimentado

            FROM transacoes

            WHERE usuario_id = ?
                AND excluido_em IS NULL
                AND data_transacao <= CURRENT_DATE
                AND tipo IN (
                    'receita',
                    'despesa'
                )

            GROUP BY conta_id
         ) movimentos
            ON movimentos.conta_id = c.id

         WHERE c.id = ?
            AND c.usuario_id = ?
            AND c.ativo = 1

         LIMIT 1
        `,
        [
            usuarioId,
            id,
            usuarioId,
        ]
    );

    return rows[0] ?? null;
}

export async function createAccount({usuarioId, nome, tipo, saldoInicial,}) {
    const [result] = await pool.execute(
        `
         INSERT INTO contas (
            usuario_id,
            nome,
            tipo,
            saldo_inicial
         )
         VALUES (?, ?, ?, ?)
        `,
        [
            usuarioId,
            nome,
            tipo,
            saldoInicial,
        ]
    );

    return findAccountByIdAndUserId(
        result.insertId,
        usuarioId
    );
}

export async function updateAccount({id, usuarioId, nome, tipo, saldoInicial,}) {
    await pool.execute(
        `
         UPDATE contas

         SET
            nome =
                COALESCE(?, nome),

            tipo =
                COALESCE(?, tipo),

            saldo_inicial =
                COALESCE(?, saldo_inicial)

         WHERE id = ?
            AND usuario_id = ?
            AND ativo = 1
        `,
        [
            nome ?? null,
            tipo ?? null,
            saldoInicial ?? null,
            id,
            usuarioId,
        ]
    );

    return findAccountByIdAndUserId(
        id,
        usuarioId
    );
}

export async function deactivateAccount(id, usuarioId) {
    const [result] = await pool.execute(
        `
         UPDATE contas

         SET ativo = 0

         WHERE id = ?
            AND usuario_id = ?
            AND ativo = 1
        `,
        [
            id,
            usuarioId,
        ]
    );

    return result.affectedRows > 0;
}
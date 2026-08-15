import { pool } from "../config/database.js";

export async function findTransactionsByUserId(usuarioId) {
        const [rows] = await pool.execute(
        `
         SELECT
            t.id,
            t.conta_id AS contaId,
            c.nome AS contaNome,
            t.categoria_id AS categoriaId,
            cat.nome AS categoriaNome,
            t.tipo,
            t.descricao,
            t.valor,
            DATE_FORMAT(
                t.data_transacao,
                '%Y-%m-%d'
            ) AS dataTransacao,
            t.observacao,
            t.criado_em AS criadoEm,
            t.atualizado_em AS atualizadoEm

         FROM transacoes t

         INNER JOIN contas c
            ON c.id = t.conta_id

         LEFT JOIN categorias cat
            ON cat.id = t.categoria_id

         WHERE t.usuario_id = ?
            AND t.excluido_em IS NULL

         ORDER BY
            t.data_transacao DESC,
            t.id DESC
        `,
        [usuarioId]
    );

    return rows;
}

export async function findTransactionByIdAndUserId(id, usuarioId) {
    const [rows] = await pool.execute(
        `
         SELECT
            t.id,
            t.conta_id AS contaId,
            c.nome AS contaNome,
            t.categoria_id AS categoriaId,
            cat.nome AS categoriaNome,
            t.tipo,
            t.descricao,
            t.valor,
            DATE_FORMAT(
                t.data_transacao,
                '%Y-%m-%d'
            ) AS dataTransacao,
            t.observacao,
            t.criado_em AS criadoEm,
            t.atualizado_em AS atualizadoEm

         FROM transacoes t

         INNER JOIN contas c
            ON c.id = t.conta_id

         LEFT JOIN categorias cat
            ON cat.id = t.categoria_id

         WHERE t.id = ?
            AND t.usuario_id = ?
            AND t.excluido_em IS NULL

         LIMIT 1
        `,
        [
            id,
            usuarioId,
        ]
    );

    return rows[0] ?? null;
}

export async function createTransaction({
    usuarioId,
    contaId,
    categoriaId,
    tipo,
    descricao,
    valor,
    dataTransacao,
    observacao,
}) {
    const [result] = await pool.execute(
        `
         INSERT INTO transacoes (
            usuario_id,
            conta_id,
            categoria_id,
            tipo,
            descricao,
            valor,
            data_transacao,
            observacao
         )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            usuarioId,
            contaId,
            categoriaId,
            tipo,
            descricao,
            valor,
            dataTransacao,
            observacao,
        ]
    );

    return findTransactionByIdAndUserId(
        result.insertId,
        usuarioId
    );
}

export async function updateTransaction({
    id,
    usuarioId,
    contaId,
    categoriaId,
    tipo,
    descricao,
    valor,
    dataTransacao,
    observacao,
}) {
    await pool.execute(
        `
         UPDATE transacoes

         SET
            conta_id = ?,
            categoria_id = ?,
            tipo = ?,
            descricao = ?,
            valor = ?,
            data_transacao = ?,
            observacao = ?

         WHERE id = ?
            AND usuario_id = ?
            AND excluido_em IS NULL
        `,
        [
            contaId,
            categoriaId,
            tipo,
            descricao,
            valor,
            dataTransacao,
            observacao,
            id,
            usuarioId,
        ]
    );

    return findTransactionByIdAndUserId(id, usuarioId);
}

export async function softDeleteTransaction(id, usuarioId) {
    const [result] = await pool.execute(
        `
         UPDATE transacoes

         SET excluido_em = CURRENT_TIMESTAMP

         WHERE id = ?
            AND usuario_id = ?
            AND excluido_em IS NULL
        `,
        [
            id,
            usuarioId,
        ]
    );

    return result.affectedRows > 0;
}
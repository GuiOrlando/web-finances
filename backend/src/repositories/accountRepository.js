import { pool } from "../config/database.js";

export async function findAccountsByUserId(usuarioId) {
    const [rows] = await pool.execute(
        `
         SELECT
            id,
            nome,
            tipo,
            saldo_inicial AS saldoInicial

         FROM contas

         WHERE usuario_id = ?
            AND ativo = 1
        
         ORDER BY criado_em DESC
        `,
        [usuarioId]
    );

    return rows;
}

export async function findAccountByIdAndUserId(id, usuarioId) {
    const [rows] = await pool.execute(
        `
         SELECT
            id,
            nome,
            tipo,
            saldo_inicial AS saldoInicial
        
         FROM contas

         WHERE id = ?
            AND usuario_id = ?
            AND ativo = 1
         
         LIMIT 1
        `,
        [
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
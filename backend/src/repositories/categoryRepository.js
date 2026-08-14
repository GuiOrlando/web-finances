import { pool } from "../config/database.js";

export async function findCategoriesByUserId(usuarioId) {
    const [rows] = await pool.execute(
        `
         SELECT
            id,
            nome,
            tipo

         FROM categorias

         WHERE usuario_id = ?
            AND ativo = 1

         ORDER BY
            tipo ASC,
            nome ASC
        `,
        [usuarioId]
    );

    return rows;
}

export async function findCategoryByIdAndUserId(id, usuarioId) {
    const [rows] = await pool.execute(
        `
         SELECT
            id,
            nome,
            tipo

         FROM categorias

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

export async function findCategoryByNameAndType(usuarioId, nome, tipo) {
    const [rows] = await pool.execute(
        `
         SELECT
            id,
            nome,
            tipo,
            ativo

         FROM categorias

         WHERE usuario_id = ?
            AND nome = ?
            AND tipo = ?

         LIMIT 1
        `,
        [
            usuarioId,
            nome,
            tipo,
        ]
    );

    return rows[0] ?? null;
}

export async function createCategory({usuarioId, nome, tipo,}) {
    const [result] = await pool.execute(
        `
         INSERT INTO categorias (
            usuario_id,
            nome,
            tipo
         )
         VALUES (?, ?, ?)
        `,
        [
            usuarioId,
            nome,
            tipo,
        ]
    );

    return findCategoryByIdAndUserId(
        result.insertId,
        usuarioId
    );
}

export async function updateCategory({id, usuarioId, nome, tipo,}) {
    await pool.execute(
        `
         UPDATE categorias

         SET
            nome = COALESCE(?, nome),
            tipo = COALESCE(?, tipo)

         WHERE id = ?
            AND usuario_id = ?
            AND ativo = 1
        `,
        [
            nome ?? null,
            tipo ?? null,
            id,
            usuarioId,
        ]
    );

    return findCategoryByIdAndUserId(
        id,
        usuarioId
    );
}

export async function deactivateCategory(id, usuarioId) {
    const [result] = await pool.execute(
        `
         UPDATE categorias

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

export async function reactivateCategory(id, usuarioId) {
    await pool.execute(
        `
         UPDATE categorias

         SET ativo = 1

         WHERE id = ?
            AND usuario_id = ?
        `,
        [
            id,
            usuarioId,
        ]
    );

    return findCategoryByIdAndUserId(
        id,
        usuarioId
    );
}
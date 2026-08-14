import {
    createCategory,
    deactivateCategory,
    findCategoryByIdAndUserId,
    findCategoryByNameAndType,
    findCategoriesByUserId,
    reactivateCategory,
    updateCategory,
} from "../repositories/categoryRepository.js";

import { AppError } from "../errors/AppError.js";

export async function listUserCategories(usuarioId) {
    return findCategoriesByUserId(
        usuarioId
    );
}

export async function getUserCategory(id, usuarioId) {
    const category =
        await findCategoryByIdAndUserId(
            id,
            usuarioId
        );

    if (!category) {
        throw new AppError(
            "Categoria não encontrada.",
            404,
            "CATEGORY_NOT_FOUND"
        );
    }

    return category;
}

export async function createUserCategory(usuarioId, data) {
    const existing =
        await findCategoryByNameAndType(
            usuarioId,
            data.nome,
            data.tipo
        );

    if (existing) {
        if (existing.ativo) {
            throw new AppError(
                "Categoria já cadastrada.",
                409,
                "CATEGORY_ALREADY_EXISTS"
            );
        }

        return reactivateCategory(
            existing.id,
            usuarioId
        );
    }

    try {
        return await createCategory({
            usuarioId,
            nome: data.nome,
            tipo: data.tipo,
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            throw new AppError(
                "Categoria já cadastrada.",
                409,
                "CATEGORY_ALREADY_EXISTS"
            );
        }

        throw error;
    }
}

export async function updateUserCategory(id, usuarioId, data) {
    const existing =
        await findCategoryByIdAndUserId(
            id,
            usuarioId
        );

    if (!existing) {
        throw new AppError(
            "Categoria não encontrada.",
            404,
            "CATEGORY_NOT_FOUND"
        );
    }

    const nextName = data.nome ?? existing.nome;
    const nextType = data.tipo ?? existing.tipo;

    const duplicate =
        await findCategoryByNameAndType(
            usuarioId,
            nextName,
            nextType
        );

    if (
        duplicate &&
        duplicate.id !== id
    ) {
        throw new AppError(
            "Categoria já cadastrada.",
            409,
            "CATEGORY_ALREADY_EXISTS"
        );
    }

    try {
        return await updateCategory({
            id,
            usuarioId,
            ...data,
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            throw new AppError(
                "Categoria já cadastrada.",
                409,
                "CATEGORY_ALREADY_EXISTS"
            );
        }

        throw error;
    }
}

export async function deactivateUserCategory(id, usuarioId) {
    const deactivated =
        await deactivateCategory(
            id,
            usuarioId
        );

    if (!deactivated) {
        throw new AppError(
            "Categoria não encontrada.",
            404,
            "CATEGORY_NOT_FOUND"
        );
    }
}
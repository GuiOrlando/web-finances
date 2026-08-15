import {
    createTransaction,
    findTransactionByIdAndUserId,
    findTransactionsByUserId,
    softDeleteTransaction,
    updateTransaction,
} from "../repositories/transactionRepository.js";

import { findAccountByIdAndUserId } from "../repositories/accountRepository.js";
import { findCategoryByIdAndUserId } from "../repositories/categoryRepository.js";
import { AppError } from "../errors/AppError.js";

function isValidDate(value) {
    const [
        year,
        month,
        day,
    ] = value
        .split("-")
        .map(Number);

    const date = new Date(
        Date.UTC(
            year,
            month - 1,
            day
        )
    );

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

function validateTransactionDate(
    dataTransacao
) {
    if (!isValidDate(dataTransacao)) {
        throw new AppError(
            "Data da transação inválida.",
            400,
            "INVALID_TRANSACTION_DATE"
        );
    }
}

async function validateAccount(
    contaId,
    usuarioId
) {
    const account =
        await findAccountByIdAndUserId(
            contaId,
            usuarioId
        );

    if (!account) {
        throw new AppError(
            "Conta não encontrada.",
            404,
            "ACCOUNT_NOT_FOUND"
        );
    }

    return account;
}

async function validateCategory(
    categoriaId,
    tipo,
    usuarioId
) {
    const category =
        await findCategoryByIdAndUserId(
            categoriaId,
            usuarioId
        );

    if (!category) {
        throw new AppError(
            "Categoria não encontrada.",
            404,
            "CATEGORY_NOT_FOUND"
        );
    }

    if (category.tipo !== tipo) {
        throw new AppError(
            "A categoria não corresponde ao tipo da transação.",
            400,
            "CATEGORY_TYPE_MISMATCH"
        );
    }

    return category;
}

export async function listUserTransactions(
    usuarioId
) {
    return findTransactionsByUserId(
        usuarioId
    );
}

export async function getUserTransaction(
    id,
    usuarioId
) {
    const transaction =
        await findTransactionByIdAndUserId(
            id,
            usuarioId
        );

    if (!transaction) {
        throw new AppError(
            "Transação não encontrada.",
            404,
            "TRANSACTION_NOT_FOUND"
        );
    }

    return transaction;
}

export async function createUserTransaction(
    usuarioId,
    data
) {
    validateTransactionDate(
        data.dataTransacao
    );

    await validateAccount(
        data.contaId,
        usuarioId
    );

    await validateCategory(
        data.categoriaId,
        data.tipo,
        usuarioId
    );

    return createTransaction({
        usuarioId,
        contaId: data.contaId,
        categoriaId:
            data.categoriaId,
        tipo: data.tipo,
        descricao: data.descricao,
        valor: data.valor,
        dataTransacao:
            data.dataTransacao,
        observacao:
            data.observacao?.trim()
                ? data.observacao
                : null,
    });
}

export async function updateUserTransaction(
    id,
    usuarioId,
    data
) {
    const existing =
        await findTransactionByIdAndUserId(
            id,
            usuarioId
        );

    if (!existing) {
        throw new AppError(
            "Transação não encontrada.",
            404,
            "TRANSACTION_NOT_FOUND"
        );
    }

    const nextData = {
        contaId:
            data.contaId ??
            existing.contaId,

        categoriaId:
            data.categoriaId ??
            existing.categoriaId,

        tipo:
            data.tipo ??
            existing.tipo,

        descricao:
            data.descricao ??
            existing.descricao,

        valor:
            data.valor ??
            existing.valor,

        dataTransacao:
            data.dataTransacao ??
            existing.dataTransacao,

        observacao:
            data.observacao !== undefined
                ? (
                    data.observacao?.trim()
                        ? data.observacao
                        : null
                )
                : existing.observacao,
    };

    if (data.dataTransacao !== undefined) {
        validateTransactionDate(
            nextData.dataTransacao
        );
    }

    if (data.contaId !== undefined) {
        await validateAccount(
            nextData.contaId,
            usuarioId
        );
    }

    if (
        data.categoriaId !== undefined ||
        data.tipo !== undefined
    ) {
        await validateCategory(
            nextData.categoriaId,
            nextData.tipo,
            usuarioId
        );
    }

    return updateTransaction({
        id,
        usuarioId,
        ...nextData,
    });
}

export async function deleteUserTransaction(
    id,
    usuarioId
) {
    const deleted =
        await softDeleteTransaction(
            id,
            usuarioId
        );

    if (!deleted) {
        throw new AppError(
            "Transação não encontrada.",
            404,
            "TRANSACTION_NOT_FOUND"
        );
    }
}
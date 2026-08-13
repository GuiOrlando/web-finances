import {
    createAccount,
    deactivateAccount,
    findAccountByIdAndUserId,
    findAccountsByUserId,
    updateAccount,
} from "../repositories/accountRepository.js";

import { AppError } from "../errors/AppError.js";

export async function listUserAccounts(usuarioId) {
    return findAccountsByUserId(
        usuarioId
    );
}

export async function getUserAccount(id, usuarioId) {
    const account =
        await findAccountByIdAndUserId(
            id,
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

export async function createUserAccount(usuarioId, data) {
    return createAccount({
        usuarioId,
        nome: data.nome,
        tipo: data.tipo,

        saldoInicial:
            data.saldoInicial ??
            "0.00",
    });
}

export async function updateUserAccount(id, usuarioId, data) {
    const existingAccount =
        await findAccountByIdAndUserId(
            id,
            usuarioId
        );

    if (!existingAccount) {
        throw new AppError(
            "Conta não encontrada.",
            404,
            "ACCOUNT_NOT_FOUND"
        );
    }

    return updateAccount({
        id,
        usuarioId,
        ...data,
    });
}

export async function deactivateUserAccount(id, usuarioId) {
    const deactivated =
        await deactivateAccount(
            id,
            usuarioId
        );

    if (!deactivated) {
        throw new AppError(
            "Conta não encontrada.",
            404,
            "ACCOUNT_NOT_FOUND"
        );
    }
}
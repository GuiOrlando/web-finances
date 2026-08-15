import {
    createUserTransaction,
    deleteUserTransaction,
    getUserTransaction,
    listUserTransactions,
    updateUserTransaction,
} from "../services/transactionService.js";

export async function listTransactions(req, res) {
    const transactions =
        await listUserTransactions(
            req.auth.user.id
        );

    return res.status(200).json({
        data: {
            transactions,
        },
    });
}

export async function getTransaction(req, res) {
    const transaction =
        await getUserTransaction(
            req.validatedParams.id,
            req.auth.user.id
        );

    return res.status(200).json({
        data: {
            transaction,
        },
    });
}

export async function createTransaction(req, res) {
    const transaction =
        await createUserTransaction(
            req.auth.user.id,
            req.validatedBody
        );

    return res.status(201).json({
        data: {
            transaction,
        },
    });
}

export async function updateTransaction(req, res) {
    const transaction =
        await updateUserTransaction(
            req.validatedParams.id,
            req.auth.user.id,
            req.validatedBody,
        );

    return res.status(200).json({
        data: {
            transaction,
        },
    });
}

export async function deleteTransaction(req, res) {
    await deleteUserTransaction(
        req.validatedParams.id,
        req.auth.user.id,
    );

    return res.status(204).send();
}
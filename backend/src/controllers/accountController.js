import {
  createUserAccount,
  deactivateUserAccount,
  getUserAccount,
  listUserAccounts,
  updateUserAccount,
} from "../services/accountService.js";

export async function listAccounts(req, res) {
    const accounts =
        await listUserAccounts(
            req.auth.user.id
        );

    return res.status(200).json({
        data: {
            accounts,
        },
    });
}

export async function getAccount(req, res) {
    const account =
        await getUserAccount(
            req.validatedParams.id,
            req.auth.user.id
        );

    return res.status(200).json({
        data: {
            account,
        },
    });
}

export async function createAccount(req, res) {
    const account =
        await createUserAccount(
        req.auth.user.id,
        req.validatedBody
        );

    return res.status(201).json({
        data: {
        account,
        },
    });
}

export async function updateAccount(req, res) {
    const account =
        await updateUserAccount(
        req.validatedParams.id,
        req.auth.user.id,
        req.validatedBody
        );

    return res.status(200).json({
        data: {
        account,
        },
    });
}

export async function deleteAccount(req, res) {
    await deactivateUserAccount(
        req.validatedParams.id,
        req.auth.user.id
    );

    return res.status(204).send();
}
import {
    createUserCategory,
    deactivateUserCategory,
    getUserCategory,
    listUserCategories,
    updateUserCategory,
} from "../services/categoryService.js";

export async function listCategories(req, res) {
    const categories =
        await listUserCategories(
            req.auth.user.id
        );

    return res.status(200).json({
        data: {
            categories,
        },
    });
}

export async function getCategory(req, res) {
    const category =
        await getUserCategory(
            req.validatedParams.id,
            req.auth.user.id
        );

    return res.status(200).json({
        data: {
            category,
        },
    });
}

export async function createCategory(req, res) {
    const category =
        await createUserCategory(
            req.auth.user.id,
            req.validatedBody
        );

    return res.status(201).json({
        data: {
            category,
        },
    });
}

export async function updateCategory(req, res) {
    const category =
        await updateUserCategory(
            req.validatedParams.id,
            req.auth.user.id,
            req.validatedBody
        );

    return res.status(200).json({
        data: {
            category,
        },
    });
}

export async function deleteCategory(req, res) {
    await deactivateUserCategory(
        req.validatedParams.id,
        req.auth.user.id
    );

    return res.status(204).send();
}
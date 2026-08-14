import { Router } from "express";

import {
    createCategory,
    deleteCategory,
    getCategory,
    listCategories,
    updateCategory,
} from "../controllers/categoryController.js";

import { validateBody, validateParams } from "../middlewares/validate.js";
import { requireAuth } from "../middlewares/requireAuth.js";

import {
    categoryIdSchema,
    createCategorySchema,
    updateCategorySchema,
} from "../validators/categorySchema.js";

const router = Router();

router.use(requireAuth);

router.get(
    "/",
    listCategories
);

router.post(
    "/",
    validateBody(
        createCategorySchema
    ),
    createCategory
);

router.get(
    "/:id",
    validateParams(
        categoryIdSchema
    ),
    getCategory
);

router.patch(
    "/:id",
    validateParams(
        categoryIdSchema
    ),
    validateBody(
        updateCategorySchema
    ),
    updateCategory
);

router.delete(
    "/:id",
    validateParams(
        categoryIdSchema
    ),
    deleteCategory
);

export default router;
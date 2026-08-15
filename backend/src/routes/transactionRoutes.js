import { Router } from "express";

import {
    createTransaction,
    deleteTransaction,
    getTransaction,
    listTransactions,
    updateTransaction,
} from "../controllers/transactionController.js";

import { validateBody, validateParams } from "../middlewares/validate.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { createTransactionSchema, transactionIdSchema, updateTransactionSchema} from "../validators/transactionSchema.js";

const router = Router();

router.use(requireAuth);

router.get(
    "/",
    listTransactions
);

router.post(
    "/",
    validateBody(
        createTransactionSchema
    ),
    createTransaction
);

router.get(
    "/:id",
    validateParams(
        transactionIdSchema
    ),
    getTransaction
);

router.patch(
    "/:id",
    validateParams(
        transactionIdSchema
    ),
    validateBody(
        updateTransactionSchema
    ),
    updateTransaction
);

router.delete(
    "/:id",
    validateParams(
        transactionIdSchema
    ),
    deleteTransaction
);

export default router;
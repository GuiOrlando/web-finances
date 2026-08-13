import { Router } from "express";

import {
  createAccount,
  deleteAccount,
  getAccount,
  listAccounts,
  updateAccount,
} from "../controllers/accountController.js";

import { validateBody, validateParams } from "../middlewares/validate.js";
import { requireAuth, } from "../middlewares/requireAuth.js";

import {
  accountIdSchema,
  createAccountSchema,
  updateAccountSchema,
} from "../validators/accountSchema.js";

const router = Router();

router.use(requireAuth);

router.get(
    "/",
    listAccounts
);

router.post(
    "/",
    validateBody(
        createAccountSchema
    ),
    createAccount
);

router.get(
    "/:id",
    validateParams(
        accountIdSchema
    ),
    getAccount
);

router.patch(
    "/:id",
    validateParams(
        accountIdSchema
    ),
    validateBody(
        updateAccountSchema
    ),
    updateAccount
);

router.delete(
    "/:id",
    validateParams(
        accountIdSchema
    ),
    deleteAccount
);

export default router;
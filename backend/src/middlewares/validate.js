import { AppError } from "../errors/AppError.js";

export function validateBody(schema) {
    return function validate(req, res, next) {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const details = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            return next(
                new AppError(
                    "Dados inválidos.",
                    400,
                    "VALIDATION_ERROR",
                    { details }
                )
            );
        }
        req.validatedBody = result.data;

        return next();
    };
}

export function validateParams(schema) {
    return function validate(req, res, next) {
        const result = schema.safeParse(
            req.params
        );

        if (!result.success) {
            const details =
                result.error.issues.map(
                    (issue) => ({
                        field:
                            issue.path.join("."),
                        message:
                            issue.message,
                    })
                );

            return next(
                new AppError(
                    "Parâmetros inválidos.",
                    400,
                    "VALIDATION_ERROR",
                    { details }
                )
            );
        }

        req.validatedParams =
            result.data;

        return next();
    };
}
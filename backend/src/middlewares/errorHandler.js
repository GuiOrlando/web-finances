import { AppError } from "../errors/AppError.js";

export function errorHandler(error, req, res, next) {
    const isOperationalError =
        error instanceof AppError;

    const statusCode = isOperationalError
        ? error.statusCode
        : 500;

    const code = isOperationalError
        ? error.code
        : "INTERNAL_ERROR";

    const message = isOperationalError
        ? error.message
        : "Erro interno do servidor.";

    console.error({
        method: req.method,
        path: req.originalUrl,
        statusCode,
        error: error.stack,
    });

    const response = {
        error: {
            code,
            message,
        },
    };

    if (isOperationalError && error.details) {
        response.error.details = error.details;
    }

    return res.status(statusCode).json(response);
}
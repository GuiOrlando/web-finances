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

    return res.status(statusCode).json({
        error: {
            code,
            message,
        },
    });
}
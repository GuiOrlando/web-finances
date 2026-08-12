import { AppError } from "../errors/AppError.js";

export function notFound(req, res, next) {
    next(
        new AppError(
            `Rota não encontrada: ${req.method} ${req.originalUrl}`,
            404,
            "ROUTE_NOT_FOUND"
        )
    );
}
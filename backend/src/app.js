import express from "express";
import helmet from "helmet";

import healthRoutes from "./routes/healthRoutes.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(helmet());

app.use(
    express.json({
        limit: "10kb",
    })
);

app.use("/api/health", healthRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
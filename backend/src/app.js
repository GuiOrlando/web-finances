import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";

import { corsOptions } from "./config/cors.js";

import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

import { csrfProtection } from "./middlewares/csrfProtection.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(helmet());

app.use(
  cors(corsOptions)
);

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(cookieParser());
app.use(csrfProtection);

app.use(
  "/api/health",
  healthRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/accounts",
  accountRoutes
);

app.use(
    "/api/categories",
    categoryRoutes
);

app.use(notFound);
app.use(errorHandler);

export default app;
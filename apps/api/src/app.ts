import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error/error.middleware";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", routes);

// Global Error Handler
app.use(errorMiddleware);

export default app;


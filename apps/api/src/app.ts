import express, { Application } from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error/error.middleware";

const app: Application = express();

// Swagger Documentation
const swaggerDocument = yaml.load(path.join(__dirname, "../../../docs/api/openapi.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", routes);

// Global Error Handler
app.use(errorMiddleware);

export default app;

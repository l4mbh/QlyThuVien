import express, { Application } from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error/error.middleware";

const app: Application = express();

// Swagger Documentation
let swaggerDocument;
try {
  // Try absolute path from project root (Works on Render)
  swaggerDocument = yaml.load(path.join(process.cwd(), "docs/api/openapi.yaml"));
} catch (e) {
  try {
    // Fallback to relative path from __dirname (Works on Local dev)
    swaggerDocument = yaml.load(path.join(__dirname, "../../../docs/api/openapi.yaml"));
  } catch (e2) {
    console.error("Could not load openapi.yaml", e2);
  }
}

if (swaggerDocument) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", routes);

// Global Error Handler
app.use(errorMiddleware);

export default app;

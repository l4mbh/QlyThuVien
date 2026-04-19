import app from "./app";
import { ENV } from "./config/env/env";

const startServer = async () => {
  try {
    const port = ENV.PORT;
    app.listen(port, () => {
      console.log(`[Server]: Backend is running at http://localhost:${port}`);
      console.log(`[Server]: Environment: ${ENV.NODE_ENV}`);
    });
  } catch (error) {
    console.error("[Server]: Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

import app from "./app";
import { ENV } from "./config/env/env";
import { initOverdueJob } from "./jobs/overdue-checker.job";
import { initReservationCleanupJob } from "./jobs/reservation-cleanup.job";
import { settingService } from "./services/settings/setting.service";

const startServer = async () => {
  try {
    const port = ENV.PORT;
    app.listen(port, () => {
      console.log(`[Server]: Backend is running at http://localhost:${port}`);
      console.log(`[Server]: Environment: ${ENV.NODE_ENV}`);
      
      // Initialize settings cache
      settingService.init();

      // Initialize background jobs
      initOverdueJob();
      initReservationCleanupJob();
    });
  } catch (error) {
    console.error("[Server]: Failed to start server:", error);
    process.exit(1);
  }
};

startServer();


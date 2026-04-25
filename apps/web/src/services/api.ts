import { createSharedApiClient } from "@qltv/shared";
import { toast } from "sonner";

// Centralized API client using the shared factory from packages/shared
// Implements "Always 200" and standard interceptors for Admin
export const api = createSharedApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  getToken: () => localStorage.getItem("token"),
  onUnauthorized: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  },
  onError: (message) => {
    toast.error(message);
  }
});

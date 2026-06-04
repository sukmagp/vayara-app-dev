import { apiClient } from "@/services/api/apiClient";
import type { ApiResponse } from "@/services/api/api.types";
import type { HomeDashboard } from "../types/home.types";
import { homeMockData } from "./home.mock";

export const homeService = Object.freeze({
  async getDashboard(): Promise<HomeDashboard> {
    const response = await apiClient.get<ApiResponse<HomeDashboard>>("/home/dashboard");
    return response.data.data;
  },

  getFallbackDashboard(): HomeDashboard {
    return homeMockData;
  },
});

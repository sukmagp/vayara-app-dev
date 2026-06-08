import type { HomeDashboard } from "../types/home.types";
import { homeStaticData } from "./home.mock";

const cloneDashboard = (dashboard: HomeDashboard): HomeDashboard => {
  return {
    ...dashboard,
    categories: [...dashboard.categories],
    myTrips: [...dashboard.myTrips],
    recommendations: [...dashboard.recommendations],
    promos: [...dashboard.promos],
  };
};

export const homeService = Object.freeze({
  getDashboard(): HomeDashboard {
    return cloneDashboard(homeStaticData);
  },

  getFallbackDashboard(): HomeDashboard {
    return cloneDashboard(homeStaticData);
  },
});
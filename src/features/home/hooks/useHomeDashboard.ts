import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys.constants";
import { homeService } from "../services/home.service";

export const useHomeDashboard = () => {
  return useQuery({
    queryKey: queryKeys.home.dashboard,
    queryFn: homeService.getDashboard,
    placeholderData: homeService.getFallbackDashboard(),
  });
};

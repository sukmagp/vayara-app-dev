import { useCallback, useMemo, useState } from "react";
import { homeService } from "../services/home.service";
import type { HomeDashboard } from "../types/home.types";

type HomeDashboardState = {
  data: HomeDashboard;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<HomeDashboard>;
};

export const useHomeDashboard = (): HomeDashboardState => {
  const [refreshVersion, setRefreshVersion] = useState(0);

  const data = useMemo(() => {
    return homeService.getDashboard();
  }, [refreshVersion]);

  const refetch = useCallback(async () => {
    const nextData = homeService.getDashboard();
    setRefreshVersion((currentValue) => currentValue + 1);
    return nextData;
  }, []);

  return {
    data,
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch,
  };
};
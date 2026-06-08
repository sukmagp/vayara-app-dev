import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { queryClient } from "@/lib/react-query/queryClient";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>{children}</SafeAreaProvider>
    </QueryClientProvider>
  );
}
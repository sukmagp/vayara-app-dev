import { DynamicIslandProvider } from "@/components/ui/DynamicIsland/DynamicIslandAlert";
import { PropsWithChildren } from "react";
import { QueryProvider } from "./QueryProvider";

export function AppProvider({ children }: PropsWithChildren) {
  return <QueryProvider><DynamicIslandProvider>{children}</DynamicIslandProvider></QueryProvider>;
}

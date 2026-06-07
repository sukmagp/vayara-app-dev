import { OFFLINE_ALLOWED_PATHS } from "@/constants/app.constants";
import { useNetworkStatus } from "@/services/network/useNetworkStatus";
import { router, usePathname } from "expo-router";
import { ReactNode, useMemo } from "react";
import { OfflineState } from "./OfflineState";

type OfflineGateProps = {
  children: ReactNode;
  allowedPaths?: readonly string[];
};

const normalizePath = (path: string) => {
  const cleanPath = path.split("?")[0]?.replace(/\/+$/, "") || "/";
  return cleanPath || "/";
};

const isPathAllowed = (pathname: string, allowedPaths: readonly string[]) => {
  const currentPath = normalizePath(pathname);

  return allowedPaths.some((path) => {
    const allowedPath = normalizePath(path);

    return (
      currentPath === allowedPath ||
      currentPath.startsWith(`${allowedPath}/`)
    );
  });
};

export function OfflineGate({
  children,
  allowedPaths = OFFLINE_ALLOWED_PATHS,
}: OfflineGateProps) {
  const pathname = usePathname();
  const { isOffline } = useNetworkStatus();

  const allowed = useMemo(() => {
    return isPathAllowed(pathname, allowedPaths);
  }, [pathname, allowedPaths]);

  if (isOffline && !allowed) {
    return (
      <OfflineState
        onActionPress={() => {
          router.replace("/(tabs)/home");
        }}
      />
    );
  }

  return children;
}
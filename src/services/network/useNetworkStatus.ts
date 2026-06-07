import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { useEffect, useMemo, useState } from "react";

type NetworkState = {
  isConnected: boolean;
  isInternetReachable: boolean;
  isInitialized: boolean;
};

const resolveNetworkState = (state: NetInfoState): NetworkState => {
  const isConnected = state.isConnected !== false;
  const isInternetReachable = state.isInternetReachable !== false;

  return {
    isConnected,
    isInternetReachable,
    isInitialized: true,
  };
};

export const useNetworkStatus = () => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true,
    isInternetReachable: true,
    isInitialized: false,
  });

  useEffect(() => {
    let mounted = true;

    NetInfo.fetch().then((state) => {
      if (!mounted) return;
      setNetworkState(resolveNetworkState(state));
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkState(resolveNetworkState(state));
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const isOffline = useMemo(() => {
    if (!networkState.isInitialized) return false;

    return (
      networkState.isConnected === false ||
      networkState.isInternetReachable === false
    );
  }, [networkState]);

  return {
    ...networkState,
    isOffline,
    isOnline: !isOffline,
  };
};
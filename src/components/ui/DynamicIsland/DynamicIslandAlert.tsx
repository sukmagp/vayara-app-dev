import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { styles } from "./DynamicIsland.styles";

type DynamicIslandVariant = "success" | "error" | "warning" | "info";

type DynamicIslandPayload = {
  title: string;
  message?: string;
  variant?: DynamicIslandVariant;
  durationMs?: number;
};

type DynamicIslandState = Required<
  Pick<DynamicIslandPayload, "title" | "variant" | "durationMs">
> & {
  id: string;
  message?: string;
};

type DynamicIslandContextValue = {
  showDynamicIsland: (payload: DynamicIslandPayload) => string;
  hideDynamicIsland: () => void;
};

const DEFAULT_DURATION_MS = 3200;
const MIN_DURATION_MS = 1400;
const MAX_DURATION_MS = 9000;
const MAX_TITLE_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 160;

const variantConfig = Object.freeze({
  success: {
    label: "Success",
    accent: "#22C55E",
    background: "rgba(8, 20, 18, 0.96)",
  },
  error: {
    label: "Error",
    accent: "#EF4444",
    background: "rgba(24, 12, 14, 0.96)",
  },
  warning: {
    label: "Warning",
    accent: "#F59E0B",
    background: "rgba(24, 18, 8, 0.96)",
  },
  info: {
    label: "Info",
    accent: "#38BDF8",
    background: "rgba(8, 17, 24, 0.96)",
  },
});

const defaultContextValue: DynamicIslandContextValue = {
  showDynamicIsland: () => "",
  hideDynamicIsland: () => undefined,
};

const DynamicIslandContext =
  createContext<DynamicIslandContextValue>(defaultContextValue);

const sanitizeText = (value: unknown, maxLength: number) => {
  if (value === undefined || value === null) return "";

  return String(value)
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
};

const clampDuration = (value?: number) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return DEFAULT_DURATION_MS;

  return Math.min(Math.max(parsed, MIN_DURATION_MS), MAX_DURATION_MS);
};

const createAlertId = () => {
  return `dynamic-island-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
};

export function DynamicIslandProvider({ children }: PropsWithChildren) {
  const { width } = useWindowDimensions();

  const [activeAlert, setActiveAlert] = useState<DynamicIslandState | null>(
    null,
  );

  const animation = useRef(new Animated.Value(0)).current;
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDismissTimer = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const hideDynamicIsland = useCallback(() => {
    clearDismissTimer();

    Animated.timing(animation, {
      toValue: 0,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setActiveAlert(null);
      }
    });
  }, [animation, clearDismissTimer]);

  const showDynamicIsland = useCallback(
    (payload: DynamicIslandPayload) => {
      const title = sanitizeText(payload.title, MAX_TITLE_LENGTH);
      const message = sanitizeText(payload.message, MAX_MESSAGE_LENGTH);
      const variant = payload.variant || "info";
      const durationMs = clampDuration(payload.durationMs);
      const id = createAlertId();

      if (!title) return "";

      const nextAlert: DynamicIslandState = {
        id,
        title,
        message,
        variant,
        durationMs,
      };

      clearDismissTimer();
      animation.stopAnimation();

      setActiveAlert(nextAlert);
      animation.setValue(0);

      requestAnimationFrame(() => {
        Animated.spring(animation, {
          toValue: 1,
          speed: 20,
          bounciness: 8,
          useNativeDriver: true,
        }).start();

        dismissTimerRef.current = setTimeout(() => {
          hideDynamicIsland();
        }, durationMs);
      });

      return id;
    },
    [animation, clearDismissTimer, hideDynamicIsland],
  );

  useEffect(() => {
    return () => {
      clearDismissTimer();
      animation.stopAnimation();
    };
  }, [animation, clearDismissTimer]);

  const contextValue = useMemo(
    () => ({
      showDynamicIsland,
      hideDynamicIsland,
    }),
    [showDynamicIsland, hideDynamicIsland],
  );

  const topOffset =
    Platform.OS === "ios" ? 58 : (StatusBar.currentHeight || 24) + 14;

  const islandWidth = Math.min(width - 32, 390);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-90, 0],
  });

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const config = activeAlert
    ? variantConfig[activeAlert.variant]
    : variantConfig.info;

  return (
    <DynamicIslandContext.Provider value={contextValue}>
      {children}

      {activeAlert ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.overlay,
            {
              top: topOffset,
              opacity,
              transform: [{ translateY }, { scale }],
            },
          ]}
        >
          <Pressable
            accessibilityRole="alert"
            accessibilityLabel={`${activeAlert.title}. ${
              activeAlert.message || ""
            }`}
            onPress={hideDynamicIsland}
            style={[
              styles.island,
              {
                width: islandWidth,
                backgroundColor: config.background,
              },
            ]}
          >
            <View style={[styles.accent, { backgroundColor: config.accent }]} />

            <View style={styles.content}>
              <View style={styles.headerRow}>
                <Text numberOfLines={1} style={styles.title}>
                  {activeAlert.title}
                </Text>

                <Text style={[styles.variantText, { color: config.accent }]}>
                  {config.label}
                </Text>
              </View>

              {activeAlert.message ? (
                <Text numberOfLines={2} style={styles.message}>
                  {activeAlert.message}
                </Text>
              ) : null}
            </View>
          </Pressable>
        </Animated.View>
      ) : null}
    </DynamicIslandContext.Provider>
  );
}

export const useDynamicIsland = () => {
  return useContext(DynamicIslandContext);
};


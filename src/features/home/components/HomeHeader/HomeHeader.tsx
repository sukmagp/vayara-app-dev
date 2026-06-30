import { colors, getThemeColors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  Pressable,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { createStyles } from "./HomeHeader.styles";

type HomeHeaderProps = {
  userName?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
};

const sanitizeText = (value?: string, fallback = "-") => {
  const text = String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text || fallback;
};

const clampNotificationCount = (value?: number) => {
  const count = Number(value);

  if (!Number.isFinite(count) || count <= 0) return 0;
  if (count > 99) return 99;

  return Math.floor(count);
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export function HomeHeader({
  userName = "Traveler",
  notificationCount = 0,
  onNotificationPress,
  onProfilePress,
}: HomeHeaderProps) {
  const { width } = useWindowDimensions();
  const deviceMode = useColorScheme();
  const theme = getThemeColors(deviceMode === "dark" ? "dark" : "light") as typeof colors;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const safeUserName = sanitizeText(userName, "Traveler");
  const safeNotificationCount = clampNotificationCount(notificationCount);

  const isSmallDevice = width < 380;
  const circleSize = clamp(width * 0.108, 38, 48);
  const iconSize = clamp(width * 0.052, 18, 23);
  const nameSize = clamp(width * 0.052, 18, 23);
  const labelSize = clamp(width * 0.035, 12, 15);

  return (
    <View style={styles.header}>
      <View style={styles.greetingWrap}>
        <Text
          numberOfLines={1}
          style={[
            styles.greetingLabel,
            {
              fontSize: labelSize,
              lineHeight: labelSize + 4,
            },
          ]}
        >
          Selamat datang,
        </Text>

        <Text
          numberOfLines={1}
          style={[
            styles.greetingName,
            {
              fontSize: nameSize,
              lineHeight: nameSize + 4,
            },
          ]}
        >
          {safeUserName}
        </Text>
      </View>

      <View style={[styles.actions, isSmallDevice ? styles.actionsSmall : null]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Buka notifikasi, ${safeNotificationCount} notifikasi belum dibaca`}
          onPress={onNotificationPress}
          style={({ pressed }) => [
            styles.circleButton,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
            },
            pressed ? styles.actionPressed : null,
          ]}
        >
          <Ionicons
            name="notifications-outline"
            size={iconSize}
            color={theme.primaryDark}
          />

          {safeNotificationCount > 0 ? (
            <View
              style={[
                styles.notificationBadge,
                {
                  minWidth: clamp(circleSize * 0.38, 16, 21),
                  height: clamp(circleSize * 0.38, 16, 21),
                  borderRadius: clamp(circleSize * 0.19, 8, 11),
                },
              ]}
            >
              <Text style={styles.notificationBadgeText}>
                {safeNotificationCount}
              </Text>
            </View>
          ) : null}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Buka profil"
          onPress={onProfilePress}
          style={({ pressed }) => [
            styles.circleButton,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
            },
            pressed ? styles.actionPressed : null,
          ]}
        >
          <Ionicons name="person" size={iconSize} color={theme.primaryDark} />
        </Pressable>
      </View>
    </View>
  );
}

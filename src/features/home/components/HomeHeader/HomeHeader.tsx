import { appImages } from "@/constants/assets";
import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./HomeHeader.styles";

type HomeHeaderProps = {
  userName?: string;
  location?: string;
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

export function HomeHeader({
  userName = "Vayara Explorer",
  location = "Jakarta, Indonesia",
  notificationCount = 3,
  onNotificationPress,
  onProfilePress,
}: HomeHeaderProps) {
  const safeUserName = sanitizeText(userName, "Traveler");
  const safeLocation = sanitizeText(location, "Indonesia");
  const safeNotificationCount = clampNotificationCount(notificationCount);

  return (
    <View style={styles.header}>
      <View style={styles.brandArea}>
        <Image source={appImages.logo} resizeMode="contain" style={styles.logo} />

        <View style={styles.greetingWrap}>
          <Text numberOfLines={1} style={styles.greetingLabel}>
            Selamat datang,
          </Text>
          <Text numberOfLines={1} style={styles.greetingName}>
            {safeUserName}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Buka notifikasi"
          onPress={onNotificationPress}
          style={({ pressed }) => [
            styles.notificationButton,
            pressed ? styles.actionPressed : null,
          ]}
        >
          <Ionicons name="notifications-outline" size={20} color={colors.primary} />

          {safeNotificationCount > 0 ? (
            <View style={styles.notificationBadge}>
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
            styles.avatar,
            pressed ? styles.actionPressed : null,
          ]}
        >
          <Ionicons name="person" size={18} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}
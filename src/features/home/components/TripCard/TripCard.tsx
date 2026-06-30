import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  Image,
  Pressable,
  Text,
  useColorScheme,
  View,
  type ImageSourcePropType,
} from "react-native";

import { appImages } from "@/constants/assets";
import { colors, getThemeColors } from "@/theme";
import type { TripCard as TripCardType } from "../../types/home.types";
import { createStyles } from "./TripCard.styles";

type TripCardProps = {
  item: TripCardType;
  onPress?: (item: TripCardType) => void;
};

const sanitizeText = (value?: string, fallback = "-") => {
  const text = String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text || fallback;
};

const resolveImageSource = (
  item: TripCardType,
  fallback: ImageSourcePropType,
): ImageSourcePropType => {
  if (item.image) return item.image;

  const imageUrl = String(item.imageUrl || "").trim();

  if (/^https:\/\//i.test(imageUrl)) {
    return { uri: imageUrl };
  }

  return fallback;
};

export function TripCard({ item, onPress }: TripCardProps) {
  const deviceMode = useColorScheme();
  const theme = getThemeColors(deviceMode === "dark" ? "dark" : "light") as typeof colors;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const safeTitle = sanitizeText(item.title, "Perjalanan");
  const safeSubtitle = sanitizeText(item.subtitle, "Tanggal belum tersedia");
  const safeMeta = sanitizeText(item.meta, "Detail belum tersedia");
  const safeStatus = sanitizeText(item.status, "Berjalan");
  const imageSource = resolveImageSource(item, appImages.onboardingThree);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Buka detail ${safeTitle}`}
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <Image
        source={imageSource}
        resizeMode="cover"
        style={styles.image}
        accessibilityIgnoresInvertColors
      />

      <View style={styles.content}>
        <View style={styles.titleGroup}>
          <Text numberOfLines={2} style={styles.title}>
            {safeTitle}
          </Text>

          <View style={styles.statusBadge}>
            <Text numberOfLines={1} style={styles.statusText}>
              {safeStatus}
            </Text>
          </View>
        </View>

        <View style={styles.metaGroup}>
          <View style={styles.metaRow}>
            <View style={styles.metaIconWrap}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={theme.primaryDark}
              />
            </View>

            <Text numberOfLines={1} style={styles.meta}>
              {safeSubtitle}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaIconWrap}>
              <Ionicons
                name="people-outline"
                size={14}
                color={theme.primaryDark}
              />
            </View>

            <Text numberOfLines={1} style={styles.meta}>
              {safeMeta}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

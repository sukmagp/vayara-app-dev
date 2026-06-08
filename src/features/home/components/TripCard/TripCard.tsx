import { appImages } from "@/constants/assets";
import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image, ImageSourcePropType, Pressable, Text, View } from "react-native";
import type { TripCard as TripCardType } from "../../types/home.types";
import { styles } from "./TripCard.styles";

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
  const imageSource = resolveImageSource(item, appImages.onboardingThree);

  const safeTitle = sanitizeText(item?.title, "Perjalanan");
  const safeSubtitle = sanitizeText(item?.subtitle, "Tanggal belum tersedia");
  const safeMeta = sanitizeText(item?.meta, "Detail belum tersedia");
  const safeStatus = sanitizeText(item?.status, "Aktif");

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
      <Image source={imageSource} resizeMode="cover" style={styles.image} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
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
                size={13}
                color={colors.primary}
              />
            </View>
            <Text numberOfLines={1} style={styles.meta}>
              {safeSubtitle}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaIconWrap}>
              <Ionicons name="people-outline" size={13} color={colors.primary} />
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
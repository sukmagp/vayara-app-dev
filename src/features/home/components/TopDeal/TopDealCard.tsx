import { appImages } from "@/constants/assets";
import { colors, getThemeColors } from "@/theme";
import { useMemo } from "react";
import {
  Image,
  Pressable,
  Text,
  useColorScheme,
  View,
  type ImageSourcePropType,
} from "react-native";

import type { TopDeal } from "../../types/home.types";
import { createStyles } from "./TopDealCard.styles";

type TopDealCardProps = {
  item: TopDeal;
  onPress?: (item: TopDeal) => void;
};

const sanitizeText = (value?: string, fallback = "-") => {
  const text = String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text || fallback;
};

const resolveImageSource = (
  item: TopDeal,
  fallback: ImageSourcePropType,
): ImageSourcePropType => {
  if (item.image) return item.image;

  const imageUrl = String(item.imageUrl || "").trim();

  if (/^https:\/\//i.test(imageUrl)) {
    return { uri: imageUrl };
  }

  return fallback;
};

const formatRupiah = (value?: number) => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) return "Rp. 0";

  return `Rp. ${Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

const formatReviewCount = (value?: number) => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) return "0";

  return Math.floor(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const formatRating = (value?: number) => {
  const rating = Number(value);

  if (!Number.isFinite(rating) || rating <= 0) return "0.0";

  return Math.min(rating, 10).toFixed(1);
};

const clampDiscount = (value?: number) => {
  const discount = Number(value);

  if (!Number.isFinite(discount) || discount <= 0) return 0;
  if (discount > 99) return 99;

  return Math.floor(discount);
};

export function TopDealCard({ item, onPress }: TopDealCardProps) {
  const deviceMode = useColorScheme();
  const theme = getThemeColors(deviceMode === "dark" ? "dark" : "light") as typeof colors;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const safeTitle = sanitizeText(item.title, "Top Deal");
  const safeLocation = sanitizeText(item.location, "Lokasi belum tersedia");
  const safeTag = sanitizeText(item.tag, "Promo");
  const discount = clampDiscount(item.discountPercent);
  const imageSource = resolveImageSource(item, appImages.onboardingTwo);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Buka detail promo ${safeTitle}`}
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.imageWrap}>
        <Image
          source={imageSource}
          resizeMode="cover"
          style={styles.image}
          accessibilityIgnoresInvertColors
        />

        <View style={styles.tagBadge}>
          <Text numberOfLines={1} style={styles.tagText}>
            {safeTag}
          </Text>
        </View>

        {discount > 0 ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}%</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>
          {safeTitle}
        </Text>

        <Text numberOfLines={1} style={styles.location}>
          {safeLocation}
        </Text>

        <Text style={styles.starText}>★★★</Text>

        <View style={styles.reviewRow}>
          <Text style={styles.ratingText}>{formatRating(item.rating)} / 10</Text>
          <Text style={styles.reviewText}>
            • {formatReviewCount(item.reviewCount)} reviewers
          </Text>
        </View>

        <Text numberOfLines={1} style={styles.originalPrice}>
          {formatRupiah(item.originalPrice)}
        </Text>

        <Text numberOfLines={1} style={styles.price}>
          {formatRupiah(item.price)}
        </Text>
      </View>
    </Pressable>
  );
}

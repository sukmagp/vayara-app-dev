import { appImages } from "@/constants/assets";
import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import {
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";
import type { PromoCard as PromoCardType } from "../../types/home.types";
import { styles } from "./PromoCard.styles";

type PromoCardProps = {
  item: PromoCardType;
  variant?: "banner" | "deal";
  onPress?: (item: PromoCardType) => void;
};

const sanitizeText = (value?: string, fallback = "-") => {
  const text = String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text || fallback;
};

const resolveImageSource = (
  item: PromoCardType,
  fallback: ImageSourcePropType,
): ImageSourcePropType => {
  if (item.image) return item.image;

  const imageUrl = String(item.imageUrl || "").trim();

  if (/^https:\/\//i.test(imageUrl)) {
    return { uri: imageUrl };
  }

  return fallback;
};

export function PromoCard({ item, onPress }: PromoCardProps) {
  const imageSource = resolveImageSource(item, appImages.onboardingOne);

  const safeTitle = sanitizeText(item?.title, "Destinasi");
  const safeSubtitle = sanitizeText(item?.subtitle, "Rekomendasi perjalanan");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Buka rekomendasi ${safeTitle}`}
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <ImageBackground
        source={imageSource}
        resizeMode="cover"
        imageStyle={styles.image}
        style={styles.imageWrap}
      >
        <View style={styles.overlay}>
          <View style={styles.badge}>
            <Ionicons name="sparkles-outline" size={12} color={colors.primary} />
            <Text style={styles.badgeText}>Pilihan Vayara</Text>
          </View>

          <View style={styles.copy}>
            <Text numberOfLines={2} style={styles.title}>
              {safeTitle}
            </Text>
            <Text numberOfLines={2} style={styles.subtitle}>
              {safeSubtitle}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}
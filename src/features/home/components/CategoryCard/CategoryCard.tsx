import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { TravelCategory } from "../../types/home.types";
import { styles } from "./CategoryCard.styles";

type CategoryCardProps = {
  item: TravelCategory;
  onPress?: (item: TravelCategory) => void;
};

const sanitizeText = (value?: string, fallback = "-") => {
  const text = String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text || fallback;
};

const resolveIconName = (icon?: string): keyof typeof Ionicons.glyphMap => {
  const fallbackIcon: keyof typeof Ionicons.glyphMap = "grid-outline";
  const candidate = String(icon || "").trim();

  if (candidate in Ionicons.glyphMap) {
    return candidate as keyof typeof Ionicons.glyphMap;
  }

  return fallbackIcon;
};

export function CategoryCard({ item, onPress }: CategoryCardProps) {
  const safeName = sanitizeText(item?.name, "Kategori");
  const iconName = resolveIconName(item?.icon);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Buka kategori ${safeName}`}
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={iconName} size={24} color={colors.primary} />
      </View>

      <Text numberOfLines={2} style={styles.text}>
        {safeName}
      </Text>
    </Pressable>
  );
}
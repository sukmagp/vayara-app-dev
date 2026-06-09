import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { TravelCategory } from "../../types/home.types";
import { styles } from "./CategoryCard.styles";

type CategoryCardProps = {
  item: TravelCategory;
  iconSize?: number;
  cardWidth?: number;
  labelColor?: string;
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

export function CategoryCard({
  item,
  iconSize = 64,
  cardWidth = 76,
  labelColor = colors.white,
  onPress,
}: CategoryCardProps) {
  const safeName = sanitizeText(item?.name, "Kategori");
  const iconName = resolveIconName(item?.icon);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Buka kategori ${safeName}`}
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.card,
        { width: cardWidth },
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            width: iconSize,
            height: iconSize,
            borderRadius: Math.round(iconSize * 0.26),
          },
        ]}
      >
        <Ionicons
          name={iconName}
          size={Math.round(iconSize * 0.42)}
          color={colors.primary}
        />
      </View>

      <Text
        numberOfLines={2}
        style={[
          styles.text,
          {
            color: labelColor,
            fontSize: iconSize <= 60 ? 11 : 12,
            lineHeight: iconSize <= 60 ? 14 : 15,
          },
        ]}
      >
        {safeName}
      </Text>
    </Pressable>
  );
}
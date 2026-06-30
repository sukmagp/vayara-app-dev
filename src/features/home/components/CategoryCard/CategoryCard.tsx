import { colors, getThemeColors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";
import type { TravelCategory } from "../../types/home.types";
import { createStyles } from "./CategoryCard.styles";

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
  labelColor,
  onPress,
}: CategoryCardProps) {
  const deviceMode = useColorScheme();
  const theme = getThemeColors(deviceMode === "dark" ? "dark" : "light") as typeof colors;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const safeName = sanitizeText(item?.name, "Kategori");
  const iconName = resolveIconName(item?.icon);
  const resolvedLabelColor = labelColor ?? theme.text;

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
            borderRadius: Math.round(iconSize * 0.28),
          },
        ]}
      >
        <Ionicons
          name={iconName}
          size={Math.round(iconSize * 0.42)}
          color={theme.primaryDark}
        />
      </View>

      <Text
        numberOfLines={2}
        style={[
          styles.text,
          {
            color: resolvedLabelColor,
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

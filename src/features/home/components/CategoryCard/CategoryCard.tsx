import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";
import type { TravelCategory } from "../../types/home.types";
import { styles } from "./CategoryCard.styles";

type CategoryCardProps = {
  item: TravelCategory;
  onPress?: (item: TravelCategory) => void;
};

export function CategoryCard({ item, onPress }: CategoryCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={() => onPress?.(item)} style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={25} color={colors.primary} />
      </View>
      <Text numberOfLines={1} style={styles.text}>{item.name}</Text>
    </Pressable>
  );
}

import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appImages } from "@/constants/assets";
import { colors } from "@/theme";
import type { TripCard as TripCardType } from "../../types/home.types";
import { styles } from "./TripCard.styles";

type TripCardProps = {
  item: TripCardType;
  onPress?: (item: TripCardType) => void;
};

export function TripCard({ item, onPress }: TripCardProps) {
  const imageSource = item.image || (item.imageUrl ? { uri: item.imageUrl } : appImages.onboardingThree);

  return (
    <Pressable accessibilityRole="button" onPress={() => onPress?.(item)} style={styles.card}>
      <Image source={imageSource} resizeMode="cover" style={styles.image} />

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>{item.title}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
          <Text style={styles.meta}>{item.subtitle}</Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="people-outline" size={13} color={colors.textMuted} />
          <Text style={styles.meta}>{item.meta}</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </Pressable>
  );
}

import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { appImages } from "@/constants/assets";
import { colors } from "@/theme";
import { styles } from "./HomeHeader.styles";

export function HomeHeader() {
  return (
    <View style={styles.header}>
      <Image source={appImages.logo} resizeMode="contain" style={styles.logo} />

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" style={styles.notificationButton}>
          <Ionicons name="notifications" size={18} color={colors.white} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </Pressable>

        <Pressable accessibilityRole="button" style={styles.avatar}>
          <Ionicons name="person" size={18} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

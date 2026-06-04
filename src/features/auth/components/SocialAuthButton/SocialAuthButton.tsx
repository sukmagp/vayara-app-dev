import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { colors } from "@/theme";
import { styles } from "./SocialAuthButton.styles";

type SocialAuthButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress?: () => void;
};

export function SocialAuthButton({ icon, title, onPress }: SocialAuthButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.button}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

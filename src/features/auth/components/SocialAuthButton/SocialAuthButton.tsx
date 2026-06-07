import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View
} from "react-native";

import { colors } from "@/theme";

import { styles } from "./SocialAuthButton.styles";

type SocialAuthButtonProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void | Promise<void>;
};

export function SocialAuthButton({
  icon,
  title,
  loading = false,
  disabled = false,
  onPress,
}: SocialAuthButtonProps) {
  const isDisabled = disabled || loading || !onPress;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && !isDisabled ? styles.buttonPressed : null,
        isDisabled ? styles.buttonDisabled : null,
      ]}
    >
      <View style={styles.iconWrap}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.text} />
        ) : (
          <Ionicons name={icon} size={20} color={colors.text} />
        )}
      </View>

      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
    </Pressable>
  );
}

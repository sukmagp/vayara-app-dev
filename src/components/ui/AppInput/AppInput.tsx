import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleProp, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import { colors } from "@/theme";
import { styles } from "./AppInput.styles";

type AppInputProps = TextInputProps & {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  secureToggle?: boolean;
  secureVisible?: boolean;
  onToggleSecure?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
};

export function AppInput({
  label,
  icon,
  error,
  secureToggle = false,
  secureVisible = false,
  onToggleSecure,
  containerStyle,
  style,
  ...props
}: AppInputProps) {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.inputWrap, error && styles.inputWrapError]}>
        {icon ? (
          <Ionicons name={icon} size={18} color={colors.textMuted} style={styles.leftIcon} />
        ) : null}

        <TextInput
          {...props}
          style={[styles.input, style]}
          placeholderTextColor={colors.textSoft}
          autoCorrect={props.autoCorrect ?? false}
          autoCapitalize={props.autoCapitalize ?? "none"}
        />

        {secureToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={secureVisible ? "Sembunyikan password" : "Tampilkan password"}
            hitSlop={10}
            onPress={onToggleSecure}
            style={styles.eyeButton}
          >
            <Ionicons
              name={secureVisible ? "eye-outline" : "eye-off-outline"}
              size={18}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

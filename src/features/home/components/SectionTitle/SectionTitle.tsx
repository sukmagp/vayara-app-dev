import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { styles } from "./SectionTitle.styles";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

const sanitizeText = (value?: string, fallback = "") => {
  const text = String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text || fallback;
};

export function SectionTitle({
  title,
  subtitle,
  actionLabel = "Lihat semua",
  onActionPress,
}: SectionTitleProps) {
  const safeTitle = sanitizeText(title, "Section");
  const safeSubtitle = sanitizeText(subtitle);
  const safeActionLabel = sanitizeText(actionLabel, "Lihat semua");

  return (
    <View style={styles.sectionHeader}>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.title}>
          {safeTitle}
        </Text>

        {safeSubtitle ? (
          <Text numberOfLines={2} style={styles.subtitle}>
            {safeSubtitle}
          </Text>
        ) : null}
      </View>

      {onActionPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={safeActionLabel}
          onPress={onActionPress}
          hitSlop={10}
          style={({ pressed }) => [
            styles.action,
            pressed ? styles.actionPressed : null,
          ]}
        >
          <Text style={styles.link}>{safeActionLabel}</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}
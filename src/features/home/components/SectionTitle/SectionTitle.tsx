import { Text, View } from "react-native";
import { styles } from "./SectionTitle.styles";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

const sanitizeText = (value?: string, fallback = "") => {
  const text = String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text || fallback;
};

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  const safeTitle = sanitizeText(title, "Section");
  const safeSubtitle = sanitizeText(subtitle);

  return (
    <View style={styles.sectionHeader}>
      <Text numberOfLines={1} style={styles.title}>
        {safeTitle}
      </Text>

      {safeSubtitle ? (
        <Text numberOfLines={2} style={styles.subtitle}>
          {safeSubtitle}
        </Text>
      ) : null}
    </View>
  );
}
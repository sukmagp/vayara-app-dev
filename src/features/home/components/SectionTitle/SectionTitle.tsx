import { Pressable, Text, View } from "react-native";
import { styles } from "./SectionTitle.styles";

type SectionTitleProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionTitle({ title, actionLabel = "Lihat semua", onActionPress }: SectionTitleProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.title}>{title}</Text>
      <Pressable accessibilityRole="button" onPress={onActionPress} hitSlop={10}>
        <Text style={styles.link}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

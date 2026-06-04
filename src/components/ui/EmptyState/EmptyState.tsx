import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "@/components/ui/AppButton";
import { colors, spacing } from "@/theme";

type EmptyStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({
  title = "Data tidak ditemukan",
  description = "Belum ada data yang bisa ditampilkan.",
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionLabel && onActionPress ? (
        <AppButton title={actionLabel} onPress={onActionPress} style={styles.button} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    marginTop: spacing.md,
  },
});

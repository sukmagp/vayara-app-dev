import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Memuat data..." }: LoadingStateProps) {
  return (
    <View style={styles.root}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  message: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "700",
  },
});

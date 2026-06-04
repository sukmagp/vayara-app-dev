import { StyleSheet } from "react-native";
import { colors, spacing } from "@/theme";

export const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900",
  },
  link: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
  },
});

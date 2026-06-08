import { colors, radius, spacing } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  copy: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.25,
  },

  subtitle: {
    marginTop: 3,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
  },

  action: {
    minHeight: 30,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(15,122,120,0.08)",
  },

  actionPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },

  link: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
  },
});
import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/theme";

export const styles = StyleSheet.create({
  card: {
    minHeight: 122,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.sm,
    flexDirection: "row",
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  image: {
    width: 104,
    height: 104,
    borderRadius: radius.md,
  },
  content: {
    flex: 1,
    paddingVertical: 4,
  },
  title: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 3,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
  statusBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    borderRadius: radius.full,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "900",
  },
});

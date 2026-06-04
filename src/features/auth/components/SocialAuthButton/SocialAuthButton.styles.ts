import { StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/theme";

export const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
  },
  text: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
});

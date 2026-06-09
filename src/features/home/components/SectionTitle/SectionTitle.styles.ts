import { colors } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: 22,
    marginBottom: 11,
  },

  title: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.6,
    lineHeight: 29,
  },

  subtitle: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 19,
  },
});
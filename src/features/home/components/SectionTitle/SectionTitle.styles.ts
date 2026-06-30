import { colors } from "@/theme";
import { StyleSheet } from "react-native";

type ThemeColors = typeof colors;

export const createStyles = (theme: ThemeColors = colors) =>
  StyleSheet.create({
    sectionHeader: {
      marginTop: 24,
      marginBottom: 12,
    },

    title: {
      color: theme.text,
      fontSize: 24,
      fontWeight: "900",
      letterSpacing: -0.6,
      lineHeight: 29,
    },

    subtitle: {
      marginTop: 4,
      color: theme.textMuted,
      fontSize: 14,
      fontWeight: "800",
      lineHeight: 19,
    },
  });

export const styles = createStyles(colors);

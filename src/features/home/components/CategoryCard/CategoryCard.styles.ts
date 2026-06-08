import { colors, radius } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: 82,
    alignItems: "center",
    gap: 8,
  },

  cardPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.97 }],
  },

  iconWrap: {
    width: 66,
    height: 66,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(15,122,120,0.1)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },

  text: {
    minHeight: 28,
    color: colors.text,
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 14,
  },
});
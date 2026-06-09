import { colors, radius, spacing } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderWidth: 1,
    borderColor: "rgba(15,122,120,0.08)",
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },

  cardPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },

  imageWrap: {
    position: "relative",
    height: 137,
    backgroundColor: "rgba(15,122,120,0.08)",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  tagBadge: {
    position: "absolute",
    left: 9,
    top: 9,
    maxWidth: "78%",
    borderRadius: radius.full,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: "rgba(255,255,255,0.88)",
  },

  tagText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "900",
  },

  discountBadge: {
    position: "absolute",
    right: 9,
    bottom: -17,
    minWidth: 42,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    borderWidth: 3,
    borderColor: colors.white,
  },

  discountText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "900",
  },

  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },

  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: -0.15,
  },

  location: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
  },

  starText: {
    marginTop: 7,
    color: "#F5B400",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  reviewRow: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 3,
  },

  ratingText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "900",
  },

  reviewText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "700",
  },

  originalPrice: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    textDecorationLine: "line-through",
  },

  price: {
    marginTop: 3,
    color: "#FF7A00",
    fontSize: 13,
    fontWeight: "900",
  },
});
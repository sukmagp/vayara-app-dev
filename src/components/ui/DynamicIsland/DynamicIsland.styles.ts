import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  island: {
    minHeight: 68,
    borderRadius: 28,
    paddingVertical: 12,
    paddingRight: 16,
    paddingLeft: 14,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 18,
  },
  accent: {
    width: 5,
    height: 42,
    borderRadius: 999,
    marginRight: 12,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.1,
  },
  variantText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  message: {
    marginTop: 4,
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 17,
  },
});
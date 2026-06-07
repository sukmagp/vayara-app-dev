import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6FBFC",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationWrap: {
    width: 240,
    height: 190,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  copy: {
    alignItems: "center",
    gap: 10,
  },
  eyebrow: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#E8F7F8",
    color: "#087D8B",
    fontSize: 12,
    fontWeight: "800",
  },
  title: {
    color: "#12303B",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  description: {
    color: "#5A6B73",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 330,
  },
  actionButton: {
    marginTop: 26,
    minHeight: 48,
    paddingHorizontal: 22,
    borderRadius: 16,
    backgroundColor: "#078B9A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#078B9A",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 4,
  },
  actionButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});
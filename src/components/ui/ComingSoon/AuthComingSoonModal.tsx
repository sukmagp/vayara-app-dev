import { memo } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
    type GestureResponderEvent,
} from "react-native";

import { colors, radius, spacing } from "@/theme";

type AuthComingSoonModalProps = {
  visible: boolean;
  title?: string;
  message?: string;
  badge?: string;
  primaryLabel?: string;
  onClose: () => void;
};

const noop = (event: GestureResponderEvent) => {
  event.stopPropagation();
};

export const AuthComingSoonModal = memo(function AuthComingSoonModal({
  visible,
  title = "Fitur segera hadir",
  message = "Kami sedang menyiapkan fitur ini agar pengalaman perjalanan kamu makin praktis, aman, dan bebas ribet.",
  badge = "Coming Soon",
  primaryLabel = "Siap, saya tunggu",
  onClose,
}: AuthComingSoonModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tutup informasi fitur segera hadir"
        style={styles.backdrop}
        onPress={onClose}
      >
        <Pressable style={styles.card} onPress={noop}>
          <View style={styles.illustrationWrap}>
            <View style={styles.sun} />
            <View style={styles.cloudOne} />
            <View style={styles.cloudTwo} />

            <View style={styles.routeLine}>
              <View style={styles.routeDot} />
              <View style={styles.routeDash} />
              <View style={styles.routeDashSmall} />
              <View style={styles.routePin}>
                <View style={styles.routePinInner} />
              </View>
            </View>

            <View style={styles.mountainBack} />
            <View style={styles.mountainFront} />

            <View style={styles.suitcase}>
              <View style={styles.suitcaseHandle} />
              <View style={styles.suitcaseLine} />
            </View>

            <View style={styles.passport}>
              <View style={styles.passportCircle} />
              <View style={styles.passportLine} />
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.badge}>{badge}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={primaryLabel}
            onPress={onClose}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed ? styles.primaryButtonPressed : null,
            ]}
          >
            <Text style={styles.primaryText}>{primaryLabel}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10, 25, 35, 0.46)",
  },

  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 32,
    padding: spacing.xl,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: "rgba(15, 122, 120, 0.12)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 16,
  },

  illustrationWrap: {
    height: 184,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#FFF3E2",
    borderWidth: 1,
    borderColor: "rgba(242, 140, 91, 0.16)",
  },

  sun: {
    position: "absolute",
    top: 22,
    right: 34,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFC857",
  },

  cloudOne: {
    position: "absolute",
    top: 28,
    left: 28,
    width: 74,
    height: 24,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.86)",
  },

  cloudTwo: {
    position: "absolute",
    top: 58,
    right: 84,
    width: 54,
    height: 18,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.72)",
  },

  routeLine: {
    position: "absolute",
    top: 76,
    left: 32,
    right: 32,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
  },

  routeDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#0F7A78",
  },

  routeDash: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
    borderRadius: 999,
    backgroundColor: "rgba(15, 122, 120, 0.28)",
  },

  routeDashSmall: {
    width: 28,
    height: 2,
    marginRight: 8,
    borderRadius: 999,
    backgroundColor: "rgba(15, 122, 120, 0.28)",
  },

  routePin: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F28C5B",
  },

  routePinInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },

  mountainBack: {
    position: "absolute",
    left: -24,
    bottom: -42,
    width: 170,
    height: 130,
    borderRadius: 34,
    transform: [{ rotate: "45deg" }],
    backgroundColor: "#8BAE8B",
  },

  mountainFront: {
    position: "absolute",
    right: -26,
    bottom: -58,
    width: 190,
    height: 150,
    borderRadius: 38,
    transform: [{ rotate: "45deg" }],
    backgroundColor: "#39A7A5",
  },

  suitcase: {
    position: "absolute",
    left: 42,
    bottom: 24,
    width: 48,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#F28C5B",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.72)",
  },

  suitcaseHandle: {
    position: "absolute",
    top: -13,
    left: 13,
    width: 22,
    height: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 3,
    borderBottomWidth: 0,
    borderColor: "#243B4A",
  },

  suitcaseLine: {
    position: "absolute",
    top: 10,
    bottom: 10,
    left: 22,
    width: 3,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.58)",
  },

  passport: {
    position: "absolute",
    right: 42,
    bottom: 24,
    width: 46,
    height: 58,
    borderRadius: 12,
    backgroundColor: "#243B4A",
    transform: [{ rotate: "-8deg" }],
  },

  passportCircle: {
    position: "absolute",
    top: 14,
    alignSelf: "center",
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#FFC857",
  },

  passportLine: {
    position: "absolute",
    bottom: 13,
    left: 10,
    right: 10,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#FFC857",
  },

  content: {
    marginTop: spacing.xl,
    alignItems: "center",
  },

  badge: {
    overflow: "hidden",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    color: "#0F7A78",
    backgroundColor: "rgba(15, 122, 120, 0.1)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  title: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.4,
  },

  message: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
    textAlign: "center",
  },

  primaryButton: {
    height: 52,
    marginTop: spacing.xl,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F7A78",
  },

  primaryButtonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});
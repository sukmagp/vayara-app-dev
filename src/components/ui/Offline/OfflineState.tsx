import { APP_NAME } from "@/constants/app.constants";
import { memo } from "react";
import {
    Pressable,
    SafeAreaView,
    Text,
    View
} from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { styles } from "./OfflineState.styles";

type OfflineStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

function OfflineIllustration() {
  return (
    <View style={styles.illustrationWrap} pointerEvents="none">
      <Svg width={220} height={170} viewBox="0 0 220 170" fill="none">
        <Circle cx="110" cy="84" r="70" fill="#E8F7F8" />
        <Circle cx="60" cy="48" r="10" fill="#BEEBF0" />
        <Circle cx="164" cy="42" r="7" fill="#BEEBF0" />
        <Circle cx="176" cy="125" r="12" fill="#BEEBF0" />

        <Rect
          x="56"
          y="56"
          width="108"
          height="76"
          rx="18"
          fill="#FFFFFF"
          stroke="#8AD6DE"
          strokeWidth="4"
        />

        <Path
          d="M78 84C95 68 125 68 142 84"
          stroke="#078B9A"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <Path
          d="M92 101C102 92 118 92 128 101"
          stroke="#078B9A"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <Circle cx="110" cy="116" r="6" fill="#078B9A" />

        <Path
          d="M66 136L154 48"
          stroke="#EF6B6B"
          strokeWidth="8"
          strokeLinecap="round"
        />

        <Path
          d="M72 145H148"
          stroke="#BEEBF0"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

function OfflineStateComponent({
  title = "Anda sedang offline",
  description = `Tenang, halaman Home ${APP_NAME} tetap bisa dibuka. Untuk mengakses menu lain, sambungkan kembali koneksi internet kamu.`,
  actionLabel = "Kembali ke Home",
  onActionPress,
}: OfflineStateProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <OfflineIllustration />

        <View style={styles.copy}>
          <Text style={styles.eyebrow}>Mode Offline</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {onActionPress ? (
          <Pressable
            onPress={onActionPress}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.actionButtonText}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

export const OfflineState = memo(OfflineStateComponent);


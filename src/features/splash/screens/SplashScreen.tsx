import { appImages } from "@/constants/assets";
import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { styles } from "../styles/SplashScreen.styles";

export function SplashScreen() {
  useEffect(() => {
    const timerId = setTimeout(() => {
      router.replace("/onboarding");
    }, 1700);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <LinearGradient colors={[colors.background, colors.mintSoft, colors.mint]} style={styles.root}>
      <View style={styles.decorOne} />
      <View style={styles.decorTwo} />

      <View style={styles.logoCard}>
        <Image source={appImages.logo} resizeMode="contain" style={styles.logo} />
      </View>

      <Text style={styles.title}>Vayara</Text>
      <Text style={styles.subtitle}>Your next journey starts here</Text>

      <View style={styles.loadingWrap}>
        {/* <View style={styles.loadingTrack}>
          <View style={styles.loadingFill} />
        </View> */}

        <View style={styles.secureRow}>
          <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
          <Text style={styles.secureText}>Secure travel companion</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

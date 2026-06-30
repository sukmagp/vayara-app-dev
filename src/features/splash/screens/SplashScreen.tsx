import { appImages } from "@/constants/assets";
import { getThemeColors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo } from "react";
import { Image, Text, useColorScheme, View } from "react-native";
import { createSplashScreenStyles } from "../styles/SplashScreen.styles";

export function SplashScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const theme = useMemo(() => getThemeColors(colorScheme), [colorScheme]);

  const styles = useMemo(
    () => createSplashScreenStyles(theme, isDarkMode),
    [theme, isDarkMode],
  );

  useEffect(() => {
    const timerId = setTimeout(() => {
      router.replace("/onboarding");
    }, 1700);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <LinearGradient
      colors={[...theme.splashGradient]}
      locations={[...theme.gradientLocations]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.root}
    >
      <View style={styles.decorOne} />
      <View style={styles.decorTwo} />
      <View style={styles.decorThree} />
      <View style={styles.decorGlow} />

      <View style={styles.contentWrap}>
        <LinearGradient
          colors={[...theme.splashAccentGradient]}
          locations={[...theme.gradientLocations]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoAura}
        >
          <LinearGradient
            colors={[...theme.logoFrameGradient]}
            locations={[...theme.gradientLocations]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoFrame}
          >
            <View style={styles.logoCard}>
              <Image source={appImages.logo} resizeMode="contain" style={styles.logo} />
            </View>
          </LinearGradient>
        </LinearGradient>

        <View style={styles.brandWrap}>
          <Text style={styles.title}>Vayara</Text>
          <Text style={styles.subtitle}>Your next journey starts here</Text>
        </View>
      </View>

      <View style={styles.loadingWrap}>
        <View style={styles.secureRow}>
          <Ionicons name="shield-checkmark" size={15} color={theme.primary} />
          <Text style={styles.secureText}>Secure travel companion</Text>
        </View>
      </View>
    </LinearGradient>
  );
}
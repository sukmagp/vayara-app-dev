import { ReactNode } from "react";
import { Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { appImages } from "@/constants/assets";
import { colors } from "@/theme";
import { styles } from "./AuthShell.styles";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground source={appImages.authBackground} resizeMode="cover" style={styles.hero}>
        <LinearGradient colors={["rgba(255,248,236,0.1)", colors.background]} style={styles.heroOverlay} />
      </ImageBackground>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Image source={appImages.logo} resizeMode="contain" style={styles.logo} />

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.form}>{children}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

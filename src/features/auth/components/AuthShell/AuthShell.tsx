import { appImages } from "@/constants/assets";
import type { ReactNode } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

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
      <ImageBackground
        source={appImages.loginIllustration}
        resizeMode="cover"
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <View style={styles.heroOverlay} />
      </ImageBackground>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <Image source={appImages.logo} resizeMode="contain" style={styles.logo} />

          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <View style={styles.form}>{children}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
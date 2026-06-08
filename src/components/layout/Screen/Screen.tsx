import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { colors } from "@/theme";

type ScreenProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  edges?: Edge[];
  safeAreaEnabled?: boolean;
  statusBarStyle?: "default" | "light-content" | "dark-content";
}>;

export function Screen({
  children,
  style,
  contentStyle,
  backgroundColor = colors.background,
  edges = ["top", "left", "right"],
  safeAreaEnabled = true,
  statusBarStyle = "dark-content",
}: ScreenProps) {
  if (!safeAreaEnabled) {
    return (
      <View style={[styles.root, { backgroundColor }, style]}>
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={backgroundColor}
          translucent={false}
        />

        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.root, { backgroundColor }, style]}
    >
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={backgroundColor}
        translucent={false}
      />

      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  content: {
    flex: 1,
  },
});
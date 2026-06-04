import { ReactNode } from "react";
import { SafeAreaView, StyleProp, View, ViewStyle } from "react-native";
import { styles } from "./Screen.styles";

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({ children, style, contentStyle }: ScreenProps) {
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

import { Screen } from "@/components/layout/Screen";
import { colors } from "@/theme";
import { Text } from "react-native";

export default function PromoScreen() {
  return (
    <Screen contentStyle={{ alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>Reels</Text>
    </Screen>
  );
}

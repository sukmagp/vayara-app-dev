import { Text } from "react-native";
import { Screen } from "@/components/layout/Screen";
import { colors } from "@/theme";

export default function ProfileScreen() {
  return (
    <Screen contentStyle={{ alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>Profile</Text>
    </Screen>
  );
}

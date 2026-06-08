import { OfflineGate } from "@/components/ui/Offline/OfflineGate";
import { colors, radius } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <OfflineGate>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            height: 72,
            paddingTop: 8,
            paddingBottom: 10,
            backgroundColor: colors.white,
            borderTopWidth: 0,
            borderTopLeftRadius: radius.lg,
            borderTopRightRadius: radius.lg,
            position: "absolute",
            shadowColor: colors.shadow,
            shadowOpacity: 0.08,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: -8 },
            elevation: 10,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "800",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Beranda",
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="trip"
          options={{
            title: "Trip Saya",
            tabBarIcon: ({ color, size }) => <Ionicons name="briefcase-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="promo"
          options={{
            title: "Reels",
            tabBarIcon: ({ color, size }) => <Ionicons name="play-circle-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          }}
        />
      </Tabs>
    </OfflineGate>
  );
}

import { useRef, useState } from "react";
import { FlatList, Image, ListRenderItemInfo, Pressable, Text, View, ViewToken } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { AppButton } from "@/components/ui/AppButton";
import { colors } from "@/theme";
import { onboardingItems } from "../constants/onboarding.data";
import type { OnboardingItem } from "../types/onboarding.types";
import { styles } from "../styles/OnboardingScreen.styles";

export function OnboardingScreen() {
  const listRef = useRef<FlatList<OnboardingItem>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLast = activeIndex === onboardingItems.length - 1;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 70 }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const index = viewableItems[0]?.index;
      if (typeof index === "number") setActiveIndex(index);
    },
  ).current;

  const goToAuth = () => router.replace("/(auth)/login");

  const handleNext = () => {
    if (isLast) {
      goToAuth();
      return;
    }

    listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
  };

  const renderItem = ({ item }: ListRenderItemInfo<OnboardingItem>) => (
    <View style={styles.slide}>
      <Image source={item.image} resizeMode="cover" style={styles.image} />

      <LinearGradient
        colors={["transparent", "rgba(255,248,236,0.94)", colors.background]}
        style={styles.gradient}
      />

      <View style={styles.copy}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <FlatList
        ref={listRef}
        data={onboardingItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {onboardingItems.map((item, index) => (
            <View key={item.id} style={[styles.dot, index === activeIndex && styles.dotActive]} />
          ))}
        </View>

        <View style={styles.footerAction}>
          {!isLast ? (
            <Pressable accessibilityRole="button" onPress={goToAuth} hitSlop={10}>
              <Text style={styles.skipText}>Lewati</Text>
            </Pressable>
          ) : (
            <View />
          )}

          <AppButton
            title={isLast ? "Get Started" : "Lanjut"}
            onPress={handleNext}
            style={styles.nextButton}
            fullWidth={false}
          />
        </View>
      </View>
    </View>
  );
}

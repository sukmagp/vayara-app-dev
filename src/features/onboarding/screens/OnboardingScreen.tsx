import { getThemeColors } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  ListRenderItemInfo,
  Pressable,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";
import { onboardingItems } from "../constants/onboarding.data";
import { createOnboardingScreenStyles } from "../styles/OnboardingScreen.styles";
import type { OnboardingItem } from "../types/onboarding.types";

const MAX_TITLE_LENGTH = 90;
const MAX_DESCRIPTION_LENGTH = 220;
const MAX_ID_LENGTH = 80;

type SafeOnboardingItem = {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
};

const sanitizeText = (value: unknown, maxLength: number, fallback: string) => {
  if (typeof value !== "string") return fallback;

  const safeValue = value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .trim();

  if (!safeValue) return fallback;

  return safeValue.length > maxLength ? safeValue.slice(0, maxLength).trim() : safeValue;
};

const isValidOnboardingItem = (item: Partial<OnboardingItem> | null | undefined) => {
  return Boolean(item?.id && item?.title && item?.description && item?.image);
};

const normalizeOnboardingItems = (items: OnboardingItem[]): SafeOnboardingItem[] => {
  return items.filter(isValidOnboardingItem).map((item, index) => {
    const safeId = sanitizeText(item.id, MAX_ID_LENGTH, `onboarding-${index}`);

    return {
      id: `${safeId}-${index}`,
      title: sanitizeText(item.title, MAX_TITLE_LENGTH, "Discover Your Journey"),
      description: sanitizeText(
        item.description,
        MAX_DESCRIPTION_LENGTH,
        "Temukan pengalaman terbaik dengan tampilan yang nyaman dan mudah digunakan.",
      ),
      image: item.image,
    };
  });
};

type OnboardingMediaSlideProps = {
  item: SafeOnboardingItem;
  theme: ReturnType<typeof getThemeColors>;
  styles: ReturnType<typeof createOnboardingScreenStyles>;
};

const OnboardingMediaSlide = memo(({ item, theme, styles }: OnboardingMediaSlideProps) => {
  const topOverlayColors = useMemo(
    () => [theme.background, "rgba(0,0,0,0)"] as const,
    [theme.background],
  );

  return (
    <View style={styles.mediaSlide}>
      <LinearGradient
        colors={[...theme.splashGradient]}
        locations={[...theme.gradientLocations]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />

      <Image source={item.image} resizeMode="cover" style={styles.fullImage} />

      <View style={styles.imageScrim} />

      <LinearGradient
        colors={topOverlayColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topImageOverlay}
      />

      <LinearGradient
        colors={[...theme.onboardingImageGradient]}
        locations={[...theme.gradientLocations]}
        start={{ x: 0, y: 0.08 }}
        end={{ x: 0, y: 1 }}
        style={styles.bottomImageOverlay}
      />

      <View style={styles.orbTop} />
      <View style={styles.orbLeft} />
      <View style={styles.orbRight} />
    </View>
  );
});

OnboardingMediaSlide.displayName = "OnboardingMediaSlide";

export function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const { width, height } = useWindowDimensions();

  const isDarkMode = colorScheme === "dark";

  const theme = useMemo(() => getThemeColors(colorScheme), [colorScheme]);
  const styles = useMemo(
    () => createOnboardingScreenStyles(theme, width, height, isDarkMode),
    [theme, width, height, isDarkMode],
  );

  const safeItems = useMemo(() => normalizeOnboardingItems(onboardingItems), []);

  const listRef = useRef<FlatList<SafeOnboardingItem>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalItems = safeItems.length;
  const activeItem = safeItems[activeIndex] ?? safeItems[0];
  const isLast = activeIndex === totalItems - 1;

  const goToAuth = useCallback(() => {
    router.replace("/(auth)/login");
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (!totalItems) return;

      const safeIndex = Math.max(0, Math.min(index, totalItems - 1));
      setActiveIndex(safeIndex);

      try {
        listRef.current?.scrollToIndex({ index: safeIndex, animated: true });
      } catch {
        listRef.current?.scrollToOffset({ offset: safeIndex * width, animated: true });
      }
    },
    [totalItems, width],
  );

  const handleNext = useCallback(() => {
    if (!totalItems || isLast) {
      goToAuth();
      return;
    }

    scrollToIndex(activeIndex + 1);
  }, [activeIndex, goToAuth, isLast, scrollToIndex, totalItems]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 70,
    minimumViewTime: 80,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const nextIndex = viewableItems[0]?.index;

      if (typeof nextIndex === "number") {
        setActiveIndex(nextIndex);
      }
    },
  ).current;

  const getItemLayout = useCallback(
    (_: ArrayLike<SafeOnboardingItem> | null | undefined, index: number) => ({
      length: width,
      offset: width * index,
      index,
    }),
    [width],
  );

  const handleScrollToIndexFailed = useCallback(
    ({ index }: { index: number }) => {
      const safeIndex = Math.max(0, Math.min(index, totalItems - 1));

      requestAnimationFrame(() => {
        setActiveIndex(safeIndex);
        listRef.current?.scrollToOffset({ offset: safeIndex * width, animated: true });
      });
    },
    [totalItems, width],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SafeOnboardingItem>) => (
      <OnboardingMediaSlide item={item} theme={theme} styles={styles} />
    ),
    [styles, theme],
  );

  if (!totalItems || !activeItem) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Konten onboarding belum tersedia</Text>
        <Text style={styles.emptyDescription}>Silakan lanjut ke halaman login.</Text>

        <Pressable accessibilityRole="button" onPress={goToAuth} style={styles.emptyButton}>
          <Text style={styles.emptyButtonText}>Masuk</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        ref={listRef}
        data={safeItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews
        overScrollMode="never"
        style={styles.mediaPager}
      />

      <View pointerEvents="box-none" style={styles.header}>
        {!isLast ? (
          <Pressable
            accessibilityRole="button"
            onPress={goToAuth}
            hitSlop={12}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>Lewati</Text>
          </Pressable>
        ) : (
          <View style={styles.skipButtonPlaceholder} />
        )}
      </View>

      <View style={styles.contentCard}>
        <LinearGradient
          colors={[theme.glassStrong, theme.authCard, theme.card]}
          locations={[0, 0.58, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.contentCardGradient}
        />

        <View style={styles.handle} />

        <Text numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.86} style={styles.title}>
          {activeItem.title}
        </Text>

        <Text numberOfLines={3} style={styles.description}>
          {activeItem.description}
        </Text>

        <View style={styles.dots}>
          {safeItems.map((item, dotIndex) => (
            <View key={`dot-${item.id}`} style={[styles.dot, dotIndex === activeIndex && styles.dotActive]} />
          ))}
        </View>

        <Pressable accessibilityRole="button" onPress={handleNext} style={styles.primaryButtonWrap}>
          <LinearGradient
            colors={[...theme.gradientBarStops]}
            locations={[...theme.gradientBarLocations]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>{isLast ? "Start" : "Lanjut"}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
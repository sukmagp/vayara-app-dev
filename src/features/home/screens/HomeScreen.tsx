import { Ionicons } from "@expo/vector-icons";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  StatusBar,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/components/layout/Screen";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { appImages } from "@/constants/assets";
import { colors, getThemeColors } from "@/theme";

import { CategoryCard } from "../components/CategoryCard";
import { FlightTicketScreen } from "../components/FlightTicket";
import { HomeHeader } from "../components/HomeHeader";
import { SectionTitle } from "../components/SectionTitle";
import { TopDealCard } from "../components/TopDeal";
import { TripCard } from "../components/TripCard";
import { useHomeDashboard } from "../hooks/useHomeDashboard";
import { createStyles } from "../styles/HomeScreen.styles";
import type {
  PromoCard as PromoCardType,
  TopDeal,
  TravelCategory,
  TripCard as TripCardType,
} from "../types/home.types";

const TOP_DEAL_PAGE_SIZE = 5;

type HomeStyles = ReturnType<typeof createStyles>;

type TopDealRow = {
  id: string;
  items: TopDeal[];
};

const sanitizeText = (value?: string, fallback = "-") => {
  const text = String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text || fallback;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const resolveImageSource = (
  item: { image?: ImageSourcePropType; imageUrl?: string | null },
  fallback: ImageSourcePropType,
): ImageSourcePropType => {
  if (item.image) return item.image;

  const imageUrl = String(item.imageUrl || "").trim();

  if (/^https:\/\//i.test(imageUrl)) {
    return { uri: imageUrl };
  }

  return fallback;
};

const buildTopDealRows = (items: TopDeal[], columnCount = 2): TopDealRow[] => {
  const rows: TopDealRow[] = [];
  const safeColumnCount = Math.max(1, Math.min(3, Math.floor(columnCount)));

  for (let index = 0; index < items.length; index += safeColumnCount) {
    const rowItems = items.slice(index, index + safeColumnCount).filter(Boolean);

    if (rowItems.length <= 0) continue;

    rows.push({
      id: rowItems.map((item) => item.id).join("-") || `row-${index}`,
      items: rowItems,
    });
  }

  return rows;
};

const RecommendationCard = memo(function RecommendationCard({
  item,
  cardWidth,
  onPress,
  styles,
}: {
  item: PromoCardType;
  cardWidth?: number;
  onPress?: (item: PromoCardType) => void;
  styles: HomeStyles;
}) {
  const safeTitle = sanitizeText(item.title, "Rekomendasi");
  const safeSubtitle = sanitizeText(item.subtitle, "Inspirasi perjalanan");
  const safeBadge = sanitizeText(item.badgeLabel, "Pilihan Vayara");
  const imageSource = resolveImageSource(item, appImages.onboardingOne);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Buka rekomendasi ${safeTitle}`}
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.recommendationCard,
        cardWidth ? { width: cardWidth } : null,
        pressed ? styles.recommendationPressed : null,
      ]}
    >
      <Image
        source={imageSource}
        resizeMode="cover"
        style={styles.recommendationImage}
        accessibilityIgnoresInvertColors
      />

      <View style={styles.recommendationOverlay}>
        <View style={styles.recommendationBadge}>
          <Ionicons
            name="sparkles-outline"
            size={15}
            color={colors.primaryDark}
          />

          <Text numberOfLines={1} style={styles.recommendationBadgeText}>
            {safeBadge}
          </Text>
        </View>

        <View style={styles.recommendationCopy}>
          <Text numberOfLines={1} style={styles.recommendationTitle}>
            {safeTitle}
          </Text>

          <Text numberOfLines={2} style={styles.recommendationSubtitle}>
            {safeSubtitle}
          </Text>
        </View>
      </View>
    </Pressable>
  );
});

export function HomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const deviceMode = useColorScheme();
  const isDarkMode = deviceMode === "dark";
  const theme = getThemeColors(isDarkMode ? "dark" : "light") as typeof colors;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { data, isLoading, isFetching, isError, refetch } = useHomeDashboard();

  const [visibleDealCount, setVisibleDealCount] = useState(TOP_DEAL_PAGE_SIZE);
  const [isLoadingMoreDeals, setIsLoadingMoreDeals] = useState(false);
  const [isFlightTicketOpen, setIsFlightTicketOpen] = useState(false);

  const categories = useMemo(() => data?.categories ?? [], [data?.categories]);
  const myTrips = useMemo(() => data?.myTrips ?? [], [data?.myTrips]);

  const recommendations = useMemo(
    () => data?.recommendations ?? [],
    [data?.recommendations],
  );

  const topDeals = useMemo(() => data?.topDeals ?? [], [data?.topDeals]);

  const isTinyDevice = width < 340;
  const isCompactDevice = width < 380;
  const isTablet = width >= 768;
  const contentPadding = clamp(width * 0.055, 16, isTablet ? 34 : 24);
  const categoryGap = isCompactDevice ? 10 : 12;
  const horizontalPadding = contentPadding * 2;
  const visibleCategoryCount = isTinyDevice
    ? 3.75
    : isCompactDevice
      ? 4.25
      : isTablet
        ? 7.2
        : 4.75;

  const categoryCardWidth = Math.max(
    64,
    Math.floor((width - horizontalPadding) / visibleCategoryCount),
  );

  const categoryIconSize = clamp(
    categoryCardWidth - 8,
    isCompactDevice ? 56 : 62,
    isTablet ? 76 : isCompactDevice ? 62 : 70,
  );

  const recommendationCardWidth = clamp(
    width * (isTablet ? 0.42 : 0.72),
    220,
    isTablet ? 360 : 320,
  );

  const topDealColumns = width >= 900 ? 3 : width < 360 ? 1 : 2;

  const visibleTopDeals = useMemo(
    () => topDeals.slice(0, visibleDealCount),
    [topDeals, visibleDealCount],
  );

  const topDealRows = useMemo(
    () => buildTopDealRows(visibleTopDeals, topDealColumns),
    [topDealColumns, visibleTopDeals],
  );

  const hasMoreTopDeals = visibleDealCount < topDeals.length;

  useEffect(() => {
    setVisibleDealCount(TOP_DEAL_PAGE_SIZE);
    setIsLoadingMoreDeals(false);
  }, [topDeals.length]);

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleSearchPress = useCallback(() => {
    // TODO: Hubungkan ke search screen setelah route pencarian tersedia.
  }, []);

  const handleNotificationPress = useCallback(() => {
    // TODO: Hubungkan ke notification screen setelah route tersedia.
  }, []);

  const handleProfilePress = useCallback(() => {
    // TODO: Hubungkan ke profile screen setelah route tersedia.
  }, []);

  const handleCategoryPress = useCallback((item: TravelCategory) => {
    const categoryId = sanitizeText(item?.id, "").toLowerCase();

    if (categoryId === "flight") {
      setIsFlightTicketOpen(true);
      return;
    }

    // TODO: Hubungkan ke category detail setelah route tersedia.
  }, []);

  const handleCloseFlightTicket = useCallback(() => {
    setIsFlightTicketOpen(false);
  }, []);

  const handleTripPress = useCallback((_item: TripCardType) => {
    // TODO: Hubungkan ke trip detail setelah route tersedia.
  }, []);

  const handleRecommendationPress = useCallback((_item: PromoCardType) => {
    // TODO: Hubungkan ke recommendation detail setelah route tersedia.
  }, []);

  const handleDealPress = useCallback((_item: TopDeal) => {
    // TODO: Hubungkan ke deal detail setelah route tersedia.
  }, []);

  const handleLoadMoreDeals = useCallback(() => {
    if (!hasMoreTopDeals || isLoadingMoreDeals) return;

    setIsLoadingMoreDeals(true);

    setVisibleDealCount((currentCount) =>
      Math.min(currentCount + TOP_DEAL_PAGE_SIZE, topDeals.length),
    );

    const timeoutId = setTimeout(() => {
      setIsLoadingMoreDeals(false);
    }, 220);

    return () => clearTimeout(timeoutId);
  }, [hasMoreTopDeals, isLoadingMoreDeals, topDeals.length]);

  const renderCategory = useCallback(
    ({ item }: { item: TravelCategory }) => (
      <CategoryCard
        item={item}
        cardWidth={categoryCardWidth}
        iconSize={categoryIconSize}
        labelColor={theme.text}
        onPress={handleCategoryPress}
      />
    ),
    [categoryCardWidth, categoryIconSize, handleCategoryPress, theme.text],
  );

  const renderRecommendation = useCallback(
    ({ item }: { item: PromoCardType }) => (
      <RecommendationCard
        item={item}
        cardWidth={recommendationCardWidth}
        onPress={handleRecommendationPress}
        styles={styles}
      />
    ),
    [handleRecommendationPress, recommendationCardWidth, styles],
  );

  const renderTopDealRow = useCallback(
    ({ item }: { item: TopDealRow }) => (
      <View style={[styles.topDealsList, { paddingHorizontal: contentPadding }]}>
        <View style={styles.topDealsRow}>
          {item.items.map((deal, index) => {
            const shouldAddSpacer = index < item.items.length - 1;

            return (
              <View
                key={deal.id}
                style={[
                  styles.topDealItem,
                  shouldAddSpacer ? styles.topDealItemSpacer : null,
                ]}
              >
                <TopDealCard item={deal} onPress={handleDealPress} />
              </View>
            );
          })}

          {topDealColumns > item.items.length ? (
            <View style={styles.topDealPlaceholder} />
          ) : null}
        </View>
      </View>
    ),
    [contentPadding, handleDealPress, styles, topDealColumns],
  );

  const headerComponent = useMemo(
    () => (
      <>
        <View
          style={[
            styles.topPanel,
            {
              paddingTop: Math.max(insets.top, 10) + 10,
              paddingHorizontal: contentPadding,
            },
          ]}
        >
          <View style={styles.topPanelGlowOne} />
          <View style={styles.topPanelGlowTwo} />
          <View style={styles.topPanelGlowThree} />

          <HomeHeader
            userName="Sukmagp"
            notificationCount={3}
            onNotificationPress={handleNotificationPress}
            onProfilePress={handleProfilePress}
          />

          {categories.length > 0 ? (
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.categoryList,
                {
                  gap: categoryGap,
                  paddingRight: contentPadding,
                },
              ]}
              renderItem={renderCategory}
            />
          ) : null}
        </View>

        <View style={[styles.body, { paddingHorizontal: contentPadding }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cari destinasi"
            onPress={handleSearchPress}
            style={({ pressed }) => [
              styles.searchBox,
              pressed ? styles.searchPressed : null,
            ]}
          >
            <Ionicons
              name="search-outline"
              size={20}
              color={theme.primaryDark}
            />

            <Text numberOfLines={1} style={styles.searchPlaceholder}>
              Cari destinasi...
            </Text>
          </Pressable>

          <View style={styles.headerAfterSearch}>
            <SectionTitle
              title="Perjalanan Saya"
              subtitle="Pantau rencana perjalanan yang sedang berjalan."
            />
          </View>

          {myTrips.length > 0 ? (
            <View style={styles.tripList}>
              {myTrips.map((trip) => (
                <TripCard key={trip.id} item={trip} onPress={handleTripPress} />
              ))}
            </View>
          ) : (
            <View style={styles.listEmptyCard}>
              <Text style={styles.listEmptyText}>
                Kamu belum memiliki perjalanan aktif.
              </Text>
            </View>
          )}

          <SectionTitle
            title="Rekomendasi"
            subtitle="Inspirasi destinasi pilihan untuk perjalanan berikutnya."
          />

          {recommendations.length > 0 ? (
            <FlatList
              data={recommendations}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.recommendationList,
                { paddingRight: contentPadding },
              ]}
              renderItem={renderRecommendation}
            />
          ) : (
            <View style={styles.listEmptyCard}>
              <Text style={styles.listEmptyText}>
                Rekomendasi perjalanan belum tersedia.
              </Text>
            </View>
          )}

          <SectionTitle
            title="Top Deals!"
            subtitle="Promo hotel terbaik, dimuat bertahap agar tetap ringan."
          />
        </View>
      </>
    ),
    [
      categories,
      categoryGap,
      contentPadding,
      handleNotificationPress,
      handleProfilePress,
      handleSearchPress,
      handleTripPress,
      insets.top,
      myTrips,
      recommendations,
      renderCategory,
      renderRecommendation,
      styles,
      theme.primaryDark,
    ],
  );

  if (isLoading && !data) {
    return (
      <Screen
        edges={["left", "right", "bottom"]}
        statusBarStyle={isDarkMode ? "light-content" : "dark-content"}
      >
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={theme.background}
          translucent={false}
        />

        <LoadingState message="Menyiapkan dashboard perjalanan..." />
      </Screen>
    );
  }

  if (isError && !data) {
    return (
      <Screen
        edges={["left", "right", "bottom"]}
        statusBarStyle={isDarkMode ? "light-content" : "dark-content"}
        contentStyle={styles.centerContent}
      >
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={theme.background}
          translucent={false}
        />

        <EmptyState
          title="Gagal memuat dashboard"
          description="Periksa koneksi atau coba lagi beberapa saat lagi."
          actionLabel="Coba Lagi"
          onActionPress={handleRefresh}
        />
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen
        edges={["left", "right", "bottom"]}
        statusBarStyle={isDarkMode ? "light-content" : "dark-content"}
        contentStyle={styles.centerContent}
      >
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={theme.background}
          translucent={false}
        />

        <EmptyState
          title="Dashboard belum tersedia"
          description="Data perjalanan belum bisa ditampilkan saat ini."
        />
      </Screen>
    );
  }

  return (
    <>
      <Screen
        edges={["left", "right"]}
        statusBarStyle={isDarkMode ? "light-content" : "dark-content"}
      >
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={theme.background}
          translucent={false}
        />

        <FlatList
          style={styles.list}
          data={topDealRows}
          keyExtractor={(item) => item.id}
          renderItem={renderTopDealRow}
          ListHeaderComponent={headerComponent}
          ListEmptyComponent={
            <View style={[styles.topDealsList, { paddingHorizontal: contentPadding }]}>
              <View style={styles.listEmptyCard}>
                <Text style={styles.listEmptyText}>Top deals belum tersedia.</Text>
              </View>
            </View>
          }
          ListFooterComponent={
            <View style={styles.topDealsFooter}>
              {isLoadingMoreDeals ? (
                <Text style={styles.topDealsFooterText}>Memuat promo...</Text>
              ) : hasMoreTopDeals ? (
                <Text style={styles.topDealsFooterText}>
                  Scroll untuk memuat promo lainnya
                </Text>
              ) : (
                <Text style={styles.topDealsFooterText}>
                  Semua top deals sudah ditampilkan
                </Text>
              )}

              <View style={styles.bottomSpacer} />
            </View>
          }
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMoreDeals}
          onEndReachedThreshold={0.45}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={7}
          removeClippedSubviews
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              tintColor={theme.primaryDark}
              colors={[theme.primaryDark]}
              progressBackgroundColor={theme.card}
              onRefresh={handleRefresh}
            />
          }
        />
      </Screen>

      <Modal
        visible={isFlightTicketOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent={false}
        onRequestClose={handleCloseFlightTicket}
      >
        <FlightTicketScreen onClose={handleCloseFlightTicket} />
      </Modal>
    </>
  );
}

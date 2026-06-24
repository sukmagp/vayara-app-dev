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
  useWindowDimensions,
  View,
  type ImageSourcePropType,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/components/layout/Screen";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { appImages } from "@/constants/assets";
import { colors } from "@/theme";

import { CategoryCard } from "../components/CategoryCard";
import { FlightTicketScreen } from "../components/FlightTicket";
import { HomeHeader } from "../components/HomeHeader";
import { SectionTitle } from "../components/SectionTitle";
import { TopDealCard } from "../components/TopDeal";
import { TripCard } from "../components/TripCard";
import { useHomeDashboard } from "../hooks/useHomeDashboard";
import { styles } from "../styles/HomeScreen.styles";
import type {
  PromoCard as PromoCardType,
  TopDeal,
  TravelCategory,
  TripCard as TripCardType,
} from "../types/home.types";

const TOP_DEAL_PAGE_SIZE = 5;

type TopDealRow = {
  id: string;
  left: TopDeal;
  right: TopDeal | null;
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

const buildTopDealRows = (items: TopDeal[]): TopDealRow[] => {
  const rows: TopDealRow[] = [];

  for (let index = 0; index < items.length; index += 2) {
    const left = items[index];
    const right = items[index + 1] || null;

    if (!left) continue;

    rows.push({
      id: right ? `${left.id}-${right.id}` : `${left.id}-single`,
      left,
      right,
    });
  }

  return rows;
};

const RecommendationCard = memo(function RecommendationCard({
  item,
  onPress,
}: {
  item: PromoCardType;
  onPress?: (item: PromoCardType) => void;
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
          <Ionicons name="sparkles-outline" size={15} color={colors.primary} />

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

  const categoryGap = width < 380 ? 10 : 12;
  const horizontalPadding = 48;
  const visibleCategoryCount = width < 380 ? 4.35 : 4.75;

  const categoryCardWidth = Math.max(
    66,
    Math.floor((width - horizontalPadding) / visibleCategoryCount),
  );

  const categoryIconSize = clamp(
    categoryCardWidth - 8,
    width < 380 ? 58 : 62,
    width < 380 ? 62 : 70,
  );

  const visibleTopDeals = useMemo(
    () => topDeals.slice(0, visibleDealCount),
    [topDeals, visibleDealCount],
  );

  const topDealRows = useMemo(
    () => buildTopDealRows(visibleTopDeals),
    [visibleTopDeals],
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
        labelColor={colors.white}
        onPress={handleCategoryPress}
      />
    ),
    [categoryCardWidth, categoryIconSize, handleCategoryPress],
  );

  const renderRecommendation = useCallback(
    ({ item }: { item: PromoCardType }) => (
      <RecommendationCard item={item} onPress={handleRecommendationPress} />
    ),
    [handleRecommendationPress],
  );

  const renderTopDealRow = useCallback(
    ({ item }: { item: TopDealRow }) => (
      <View style={styles.topDealsList}>
        <View style={styles.topDealsRow}>
          <View style={[styles.topDealItem, styles.topDealItemSpacer]}>
            <TopDealCard item={item.left} onPress={handleDealPress} />
          </View>

          {item.right ? (
            <View style={styles.topDealItem}>
              <TopDealCard item={item.right} onPress={handleDealPress} />
            </View>
          ) : (
            <View style={styles.topDealPlaceholder} />
          )}
        </View>
      </View>
    ),
    [handleDealPress],
  );

  const headerComponent = useMemo(
    () => (
      <>
        <View
          style={[
            styles.topPanel,
            {
              paddingTop: Math.max(insets.top, 10) + 10,
            },
          ]}
        >
          <View style={styles.topPanelGlowOne} />
          <View style={styles.topPanelGlowTwo} />

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
                },
              ]}
              renderItem={renderCategory}
            />
          ) : null}
        </View>

        <View style={styles.body}>
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
              color={colors.textMuted}
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
              contentContainerStyle={styles.recommendationList}
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
      handleNotificationPress,
      handleProfilePress,
      handleSearchPress,
      handleTripPress,
      insets.top,
      myTrips,
      recommendations,
      renderCategory,
      renderRecommendation,
    ],
  );

  if (isLoading && !data) {
    return (
      <Screen edges={["left", "right", "bottom"]} statusBarStyle="light-content">
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.primary}
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
        statusBarStyle="light-content"
        contentStyle={styles.centerContent}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.primary}
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
        statusBarStyle="light-content"
        contentStyle={styles.centerContent}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.primary}
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
      <Screen edges={["left", "right"]} statusBarStyle="light-content">
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.primary}
          translucent={false}
        />

        <FlatList
          style={styles.list}
          data={topDealRows}
          keyExtractor={(item) => item.id}
          renderItem={renderTopDealRow}
          ListHeaderComponent={headerComponent}
          ListEmptyComponent={
            <View style={styles.topDealsList}>
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
              tintColor={colors.primary}
              colors={[colors.primary]}
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
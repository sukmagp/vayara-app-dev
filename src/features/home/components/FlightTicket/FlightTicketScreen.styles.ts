import { colors } from "@/theme";
import { Platform, StyleSheet } from "react-native";

const cardShadow = Platform.select({
  ios: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  android: {
    elevation: 6,
  },
  default: {},
});

const PAGE_PADDING = 16;

export const flightTicketStyles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.background,
  },

  header: {
    width: "100%",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerRow: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  headerBackButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.border,
  },

  headerTitleBlock: {
    flex: 1,
  },

  headerTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  headerSubtitle: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },

  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.border,
  },

  scrollContent: {
    width: "100%",
    paddingHorizontal: PAGE_PADDING,
    paddingBottom: 214,
    gap: 0,
  },

  searchScroll: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.background,
  },

  searchScrollContent: {
    width: "100%",
    paddingHorizontal: 0,
    paddingBottom: 214,
  },

  searchHeroFrame: {
    width: "100%",
    height: 232,
    marginTop: 0,
    marginHorizontal: 0,
    borderRadius: 0,
    overflow: "hidden",
    backgroundColor: colors.primarySoft,
    position: "relative",
  },

  searchHeroImageSource: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },

  searchHeroContent: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 16,
  },

  searchHeroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primarySoft,
  },


  searchBackButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glassStrong,
    borderWidth: 1,
    borderColor: colors.border,
  },

  heroCard: {
    marginTop: 12,
    padding: 22,
    borderRadius: 34,
    backgroundColor: colors.primaryDark,
    overflow: "hidden",
  },

  heroGlowOne: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 80,
    top: -78,
    right: -56,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },

  heroGlowTwo: {
    position: "absolute",
    width: 132,
    height: 132,
    borderRadius: 60,
    bottom: -68,
    left: -40,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
  },

  heroEyebrow: {
    color: "rgba(255, 255, 255, 0.78)",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  heroTitle: {
    marginTop: 8,
    color: colors.white,
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 31,
    letterSpacing: -0.6,
  },

  heroSubtitle: {
    marginTop: 8,
    width: "100%",
    color: "rgba(255, 255, 255, 0.88)",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },

  searchFormWrap: {
    width: "100%",
    marginTop: -34,
    paddingHorizontal: 0,
  },

  formCard: {
    width: "90%",
    alignSelf: "center",

    marginTop: 0,
    marginHorizontal: 0,
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 18,

    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,

    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: colors.border,

    ...cardShadow,
  },

  formCardCompact: {
    width: "100%",
    marginTop: 0,
    marginHorizontal: 0,
    borderRadius: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },

  searchFormHeader: {
    marginBottom: 14,
  },

  searchFormTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.2,
  },

  searchFormSubtitle: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
  },

  fieldStack: {
    gap: 12,
  },

  inputRow: {
    width: "100%",
    flexDirection: "column",
    gap: 14,
  },

  datePairSingle: {
    width: "100%",
  },

  datePairRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
    gap: 10,
  },

  datePairRowStacked: {
    flexDirection: "column",
    gap: 12,
  },

  datePairItem: {
    flex: 1,
    minWidth: 0,
  },

  fieldButton: {
    width: "100%",
    minHeight: 62,
    alignSelf: "stretch",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  fieldButtonPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },

  fieldButtonDisabled: {
    opacity: 0.55,
  },

  fieldIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryMuted,
  },

  fieldCopy: {
    flex: 1,
    minWidth: 0,
  },

  fieldLabel: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "900",
  },

  fieldValue: {
    marginTop: 3,
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },

  fieldValueMuted: {
    color: colors.textSoft,
  },

  primaryButton: {
    width: "100%",
    minHeight: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 18,
    flexDirection: "row",
    gap: 8,
  },

  primaryButtonDisabled: {
    opacity: 0.55,
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
  },

  secondaryButton: {
    width: "100%",
    minHeight: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: 18,
  },

  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },

  errorBox: {
    marginTop: 12,
    borderRadius: 16,
    padding: 12,
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.dangerSoft,
  },

  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17,
  },

  resultSummaryCard: {
    width: "100%",
    marginTop: 12,
    padding: 16,
    borderRadius: 26,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },

  routeTitle: {
    width: "100%",
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },

  routeMeta: {
    width: "100%",
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
  },

  dateTabs: {
    width: "100%",
    marginTop: 14,
  },

  dateTabsContent: {
    gap: 10,
    paddingRight: PAGE_PADDING,
  },

  dateChip: {
    minWidth: 112,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },

  dateChipActive: {
    borderColor: colors.primaryDark,
    backgroundColor: colors.primaryMuted,
  },

  dateChipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  dateChipPrice: {
    marginTop: 4,
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },

  listStack: {
    width: "100%",
    marginTop: 16,
    gap: 14,
  },

  scheduleCard: {
    width: "100%",
    borderRadius: 26,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...cardShadow,
  },

  schedulePressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },

  scheduleInner: {
    width: "100%",
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 12,
  },

  airlineLogo: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },

  airlineLogoText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },

  scheduleMain: {
    flex: 1,
    minWidth: 0,
  },

  timeRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  timeText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    flexShrink: 0,
  },

  planeLine: {
    flex: 1,
    minWidth: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  line: {
    flex: 1,
    minWidth: 12,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.overlay,
  },

  airportCodeRow: {
    width: "100%",
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  airportCode: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
  },

  durationText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
  },

  badgeRow: {
    width: "100%",
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  smallBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.inputMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },

  smallBadgeText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "900",
  },

  priceColumn: {
    width: "100%",
    alignItems: "flex-start",
    gap: 2,
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  originalPrice: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: "800",
    textDecorationLine: "line-through",
  },

  priceText: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "900",
  },

  priceCaption: {
    color: colors.textSoft,
    fontSize: 10,
    fontWeight: "700",
  },

  emptyCard: {
    width: "100%",
    marginTop: 16,
    borderRadius: 26,
    padding: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },

  emptyDescription: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 18,
  },

  detailCard: {
    width: "100%",
    marginTop: 12,
    padding: 16,
    borderRadius: 26,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },

  detailDate: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },

  timeline: {
    width: "100%",
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  timelineTime: {
    width: 48,
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },

  timelineTrack: {
    alignItems: "center",
    gap: 4,
  },

  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    backgroundColor: colors.card,
  },

  timelineLine: {
    width: 2,
    height: 42,
    backgroundColor: colors.primaryMuted,
  },

  timelineCopy: {
    flex: 1,
    gap: 26,
  },

  timelineCity: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },

  timelineBadgeRow: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  fareCard: {
    width: "100%",
    marginTop: 16,
    padding: 18,
    borderRadius: 26,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },

  fareClass: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "800",
  },

  farePrice: {
    marginTop: 4,
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
  },

  fareList: {
    marginTop: 14,
    gap: 6,
  },

  fareListText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },

  inlineButtonWrap: {
    width: "100%",
    marginTop: 18,
    alignItems: "stretch",
  },

  miniButton: {
    minWidth: 104,
    minHeight: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primaryDark,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
  },

  miniButtonText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
  },

  sectionCard: {
    width: "100%",
    marginTop: 12,
    borderRadius: 26,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...cardShadow,
  },

  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  sectionHeaderTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },

  sectionContent: {
    padding: 16,
    gap: 12,
  },

  passengerCard: {
    width: "100%",
    minHeight: 68,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  radioDot: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },

  radioDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primaryDark,
  },

  passengerName: {
    flex: 1,
    minWidth: 0,
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },

  contactName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },

  contactMeta: {
    width: "100%",
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },

  optionCard: {
    width: "100%",
    minHeight: 72,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  optionCardSelected: {
    borderColor: colors.primaryDark,
    backgroundColor: colors.primarySoft,
  },

  optionText: {
    flex: 1,
    minWidth: 0,
  },

  optionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },

  optionDescription: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
  },

  optionPrice: {
    flexShrink: 0,
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },

  paymentCountdown: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },

  timerPill: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },

  timerText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    paddingHorizontal: PAGE_PADDING,
    paddingTop: 14,
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },

  bottomBarContent: {
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: 12,
  },

  bottomPriceCaption: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "800",
  },

  bottomOriginalPrice: {
    marginTop: 4,
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "800",
    textDecorationLine: "line-through",
  },

  bottomPrice: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },

  bottomButton: {
    width: "100%",
    minWidth: 0,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },

  modalBackdropCenter: {
    justifyContent: "center",
    paddingHorizontal: PAGE_PADDING,
  },

  bottomSheet: {
    width: "100%",
    maxHeight: "88%",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 28,
  },

  dialogCard: {
    width: "100%",
    borderRadius: 28,
    backgroundColor: colors.card,
    padding: 18,
  },

  sheetHandle: {
    alignSelf: "center",
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.borderStrong,
    marginBottom: 14,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },

  sheetTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 19,
    fontWeight: "900",
    textAlign: "center",
  },

  sheetCloseButton: {
    width: 38,
    height: 38,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.inputMuted,
  },

  optionRow: {
    width: "100%",
    minHeight: 54,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  optionRowActive: {
    borderColor: colors.primaryDark,
    backgroundColor: colors.primarySoft,
  },

  optionRowTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },

  optionRowDescription: {
    marginTop: 3,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },

  modalList: {
    gap: 10,
  },

  cabinGrid: {
    width: "100%",
    gap: 10,
  },

  cabinChip: {
    width: "100%",
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
  },

  cabinChipActive: {
    borderColor: colors.primaryDark,
    backgroundColor: colors.primarySoft,
  },

  cabinChipTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },

  cabinChipDescription: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },

  counterRow: {
    width: "100%",
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },

  counterTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },

  counterDescription: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },

  counterControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  counterButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.inputMuted,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },

  counterButtonDisabled: {
    opacity: 0.38,
  },

  counterValue: {
    minWidth: 20,
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },

  sheetActions: {
    width: "100%",
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
  },

  sheetActionItem: {
    flex: 1,
  },

  statusHero: {
    width: "100%",
    marginTop: 24,
    padding: 24,
    borderRadius: 28,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    ...cardShadow,
  },

  statusIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryMuted,
  },

  statusTitle: {
    marginTop: 16,
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
  },

  statusDescription: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 19,
  },

  statusInfoCard: {
    width: "100%",
    marginTop: 14,
    padding: 16,
    borderRadius: 26,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },


  tripTabs: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
    padding: 5,
    marginBottom: 14,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.border,
  },

  tripTab: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  tripTabActive: {
    backgroundColor: colors.primaryDark,
  },

  tripTabText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
  },

  tripTabTextActive: {
    color: colors.white,
  },

  calendarCard: {
    width: "100%",
    borderRadius: 28,
    backgroundColor: colors.card,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...cardShadow,
  },

  calendarHeader: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  calendarNavButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryMuted,
  },

  calendarTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },

  calendarWeekRow: {
    marginTop: 16,
    flexDirection: "row",
  },

  calendarWeekText: {
    flex: 1,
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },

  calendarGrid: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  calendarDay: {
    width: "14.2857%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },

  calendarDayActive: {
    backgroundColor: colors.primaryDark,
  },

  calendarDayText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },

  calendarDayTextActive: {
    color: colors.white,
    fontWeight: "900",
  },

  calendarActions: {
    width: "100%",
    marginTop: 16,
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: 10,
  },

  statusRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 8,
  },

  statusLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
  },

  statusValue: {
    flex: 1,
    minWidth: 0,
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right",
  },
});

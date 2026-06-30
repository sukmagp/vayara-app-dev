export type ThemeMode = "light" | "dark";

const brandCyan = "#70E1F5";
const brandCyanSoft = "#8BE7F3";
const brandSage = "#D9E9D1";
const brandSand = "#EECDA3";

const gradientStops = [brandCyanSoft, brandSage, brandSand] as const;
const gradientReverseStops = [brandSand, brandSage, brandCyanSoft] as const;
const gradientLocations = [0, 0.5, 1] as const;

const gradient =
  "linear-gradient(135deg, #8BE7F3 0%, #D9E9D1 50%, #EECDA3 100%)";

const gradientHorizontal =
  "linear-gradient(90deg, #8BE7F3 0%, #D9E9D1 50%, #EECDA3 100%)";

const gradientReverse =
  "linear-gradient(90deg, #EECDA3 0%, #D9E9D1 50%, #8BE7F3 100%)";

const gradientSoft =
  "linear-gradient(135deg, rgba(139, 231, 243, 0.12) 0%, rgba(217, 233, 209, 0.16) 50%, rgba(238, 205, 163, 0.18) 100%)";

const gradientText =
  "linear-gradient(90deg, #4DBFD0 0%, #7CBFA4 48%, #C49A63 100%)";

const gradientBar =
  "linear-gradient(90deg, #EECDA3 0%, #D9E9D1 50%, #8BE7F3 100%)";

export const gradientCombo = Object.freeze({
  cyan: brandCyan,
  cyanSoft: brandCyanSoft,
  sage: brandSage,
  sand: brandSand,

  gradientStops,
  gradientReverseStops,
  gradientLocations,

  gradient,
  gradientHorizontal,
  gradientReverse,
  gradientSoft,
  gradientText,
  gradientBar,
});

export const colors = Object.freeze({
  primary: brandCyan,
  primaryDark: "#317783",
  primarySoft: "#EEF9FA",
  primaryMuted: "rgba(112, 225, 245, 0.14)",

  accent: brandSand,
  accentDark: "#A87945",
  accentSoft: "#FFF4E6",

  mint: brandSage,
  mintSoft: "#F3FAF4",

  background: "#F7FAF7",
  card: "#FFFDF8",
  white: "#FFFFFF",
  black: "#000000",

  text: "#294849",
  textMuted: "#748A89",
  textSoft: "#A4B4B0",

  border: "rgba(41, 72, 73, 0.10)",
  borderStrong: "rgba(41, 72, 73, 0.18)",

  danger: "#D94A4A",
  dangerSoft: "#FDECEC",
  success: "#1E9E73",
  successSoft: "#E7F8F1",
  warning: "#D98C00",
  warningSoft: "#FFF4D8",

  shadow: "rgba(74, 119, 121, 0.14)",

  gradientStops,
  gradientReverseStops,
  gradientLocations,

  gradientBarStops: gradientReverseStops,
  gradientBarLocations: gradientLocations,
  gradientBarIcon: "#294849",

  splashGradient: ["#F7FEFF", "#F5FAF3", "#FFF4E6"] as const,
  splashAccentGradient: gradientStops,
  splashAccentGradientReverse: gradientReverseStops,
  logoFrameGradient: gradientStops,

  onboardingImageGradient: [
    "transparent",
    "rgba(247, 250, 247, 0.88)",
    "#F7FAF7",
  ] as const,

  dot: "rgba(41, 72, 73, 0.18)",

  decorOne: "rgba(238, 205, 163, 0.20)",
  decorTwo: "rgba(112, 225, 245, 0.14)",
  decorThree: "rgba(217, 233, 209, 0.20)",

  glass: "rgba(255, 253, 248, 0.64)",
  glassStrong: "rgba(255, 253, 248, 0.88)",
  glassBorder: "rgba(41, 72, 73, 0.08)",

  input: "#FFFDF8",
  inputMuted: "#F5F8F4",
  inputBorder: "rgba(41, 72, 73, 0.12)",
  inputBorderFocused: brandCyanSoft,

  overlay: "rgba(41, 72, 73, 0.14)",
  authCard: "rgba(255, 253, 248, 0.92)",

  gradient,
  gradientHorizontal,
  gradientReverse,
  gradientSoft,
  gradientText,
  gradientBar,

  buttonGradient: gradientBar,
  headerGradient: gradient,

  cardGradient:
    "linear-gradient(135deg, rgba(139, 231, 243, 0.08) 0%, rgba(217, 233, 209, 0.12) 50%, rgba(238, 205, 163, 0.14) 100%)",
});

export const darkColors = Object.freeze({
  primary: brandCyanSoft,
  primaryDark: brandCyan,
  primarySoft: "rgba(139, 231, 243, 0.12)",
  primaryMuted: "rgba(139, 231, 243, 0.14)",

  accent: brandSand,
  accentDark: "#D7B47F",
  accentSoft: "rgba(238, 205, 163, 0.12)",

  mint: brandSage,
  mintSoft: "rgba(217, 233, 209, 0.10)",

  background: "#152425",
  card: "#1D3031",
  white: "#FFFFFF",
  black: "#000000",

  text: "#F3EBDD",
  textMuted: "#B8CAC5",
  textSoft: "#879C98",

  border: "rgba(243, 235, 221, 0.10)",
  borderStrong: "rgba(243, 235, 221, 0.18)",

  danger: "#FF7777",
  dangerSoft: "rgba(255, 119, 119, 0.12)",
  success: "#54D6A2",
  successSoft: "rgba(84, 214, 162, 0.12)",
  warning: "#F4B75F",
  warningSoft: "rgba(244, 183, 95, 0.12)",

  shadow: "rgba(0, 0, 0, 0.24)",

  gradientStops,
  gradientReverseStops,
  gradientLocations,

  gradientBarStops: gradientReverseStops,
  gradientBarLocations: gradientLocations,
  gradientBarIcon: "#152425",

  splashGradient: ["#152425", "#1B3031", "#263C39"] as const,
  splashAccentGradient: gradientStops,
  splashAccentGradientReverse: gradientReverseStops,
  logoFrameGradient: gradientReverseStops,

  onboardingImageGradient: [
    "transparent",
    "rgba(21, 36, 37, 0.86)",
    "#152425",
  ] as const,

  dot: "rgba(139, 231, 243, 0.22)",

  decorOne: "rgba(238, 205, 163, 0.12)",
  decorTwo: "rgba(139, 231, 243, 0.12)",
  decorThree: "rgba(217, 233, 209, 0.08)",

  glass: "rgba(255, 255, 255, 0.08)",
  glassStrong: "rgba(29, 48, 49, 0.88)",
  glassBorder: "rgba(243, 235, 221, 0.10)",

  input: "#203536",
  inputMuted: "#192A2B",
  inputBorder: "rgba(243, 235, 221, 0.12)",
  inputBorderFocused: brandCyanSoft,

  overlay: "rgba(21, 36, 37, 0.40)",
  authCard: "rgba(29, 48, 49, 0.92)",

  gradient:
    "linear-gradient(135deg, #70E1F5 0%, #BFDCC5 50%, #EECDA3 100%)",

  gradientHorizontal:
    "linear-gradient(90deg, #70E1F5 0%, #BFDCC5 50%, #EECDA3 100%)",

  gradientReverse:
    "linear-gradient(90deg, #EECDA3 0%, #BFDCC5 50%, #70E1F5 100%)",

  gradientSoft:
    "linear-gradient(135deg, rgba(139, 231, 243, 0.12) 0%, rgba(217, 233, 209, 0.10) 50%, rgba(238, 205, 163, 0.12) 100%)",

  gradientText:
    "linear-gradient(90deg, #A7EEF7 0%, #D9E9D1 48%, #EECDA3 100%)",

  gradientBar:
    "linear-gradient(90deg, #EECDA3 0%, #D9E9D1 50%, #8BE7F3 100%)",

  buttonGradient:
    "linear-gradient(90deg, #EECDA3 0%, #D9E9D1 50%, #8BE7F3 100%)",

  headerGradient:
    "linear-gradient(135deg, #70E1F5 0%, #BFDCC5 50%, #EECDA3 100%)",

  cardGradient:
    "linear-gradient(135deg, rgba(139, 231, 243, 0.08) 0%, rgba(217, 233, 209, 0.08) 50%, rgba(238, 205, 163, 0.10) 100%)",
});

export const themeColors = Object.freeze({
  light: colors,
  dark: darkColors,
});

export type AppThemeColors = typeof colors | typeof darkColors;

export const getThemeColors = (
  mode: ThemeMode | null | undefined = "light"
): AppThemeColors => {
  return mode === "dark" ? darkColors : colors;
};
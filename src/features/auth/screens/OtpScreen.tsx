import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";

import { OTP_LENGTH } from "@/constants/app.constants";
import { appImages } from "@/constants/assets";
import { getThemeColors } from "@/theme";
import { getSafeErrorMessage } from "@/utils/error.utils";

import { useAuth } from "../hooks/useAuth";
import { createOtpScreenStyles } from "../styles/OtpScreen.styles";

const RESEND_COOLDOWN_SECONDS = 30;
const MAX_IDENTIFIER_LENGTH = 160;

const getParamValue = (value?: string | string[]) => {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (typeof rawValue !== "string") return "";

  return rawValue
    .trim()
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .slice(0, MAX_IDENTIFIER_LENGTH);
};

const isMaskedIdentifier = (value: string) => {
  return /[*•]/.test(value);
};

const isValidIdentifier = (value: string) => {
  const identifier = value.trim();

  if (!identifier || isMaskedIdentifier(identifier)) return false;
  if (identifier.length > MAX_IDENTIFIER_LENGTH) return false;

  return /^[a-zA-Z0-9@._-]+$/.test(identifier);
};

const maskEmail = (value: string) => {
  const identifier = value.trim();

  if (!identifier) return "email anda";
  if (isMaskedIdentifier(identifier)) return identifier;

  const [name, domain] = identifier.split("@");

  if (!name || !domain) {
    if (identifier.length <= 4) return "****";
    return `${identifier.slice(0, 2)}${"*".repeat(Math.max(identifier.length - 2, 3))}`;
  }

  const visiblePrefix = name.slice(0, 2);
  const hiddenLength = Math.max(name.length - 2, 3);

  return `${visiblePrefix}${"*".repeat(hiddenLength)}@${domain}`;
};

const formatCountdown = (seconds: number) => {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const minute = Math.floor(safeSeconds / 60);
  const second = safeSeconds % 60;

  return `${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
};

type GradientOtpButtonProps = {
  title: string;
  loading: boolean;
  disabled: boolean;
  onPress: () => void;
  theme: ReturnType<typeof getThemeColors>;
  styles: ReturnType<typeof createOtpScreenStyles>;
};

const GradientOtpButton = memo(
  ({ title, loading, disabled, onPress, theme, styles }: GradientOtpButtonProps) => {
    const isDisabled = disabled || loading;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.gradientButtonWrap,
          pressed && !isDisabled ? styles.gradientButtonPressed : null,
          isDisabled ? styles.gradientButtonDisabled : null,
        ]}
      >
        <LinearGradient
          colors={[...theme.gradientBarStops]}
          locations={[...theme.gradientBarLocations]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.gradientBarIcon} />
          ) : (
            <Text style={styles.gradientButtonText}>{title}</Text>
          )}
        </LinearGradient>
      </Pressable>
    );
  },
);

GradientOtpButton.displayName = "GradientOtpButton";

export function OtpScreen() {
  const colorScheme = useColorScheme();
  const { width, height } = useWindowDimensions();

  const theme = useMemo(() => getThemeColors(colorScheme), [colorScheme]);
  const styles = useMemo(() => createOtpScreenStyles(theme, width, height), [theme, width, height]);

  const params = useLocalSearchParams<{
    identifier?: string;
    email?: string;
    purpose?: string;
    otpToken?: string;
    sessionId?: string;
  }>();

  const rawIdentifier = useMemo(() => {
    const identifierParam = getParamValue(params.identifier);
    const emailParam = getParamValue(params.email);

    return identifierParam || emailParam;
  }, [params.identifier, params.email]);

  const purpose = useMemo(() => {
    return getParamValue(params.purpose) === "register" ? "register" : "login";
  }, [params.purpose]);

  const otpToken = useMemo(() => {
    return getParamValue(params.otpToken);
  }, [params.otpToken]);

  const sessionId = useMemo(() => {
    return getParamValue(params.sessionId);
  }, [params.sessionId]);

  const displayIdentifier = useMemo(() => {
    const emailParam = getParamValue(params.email);
    return emailParam || rawIdentifier || "email anda";
  }, [params.email, rawIdentifier]);

  const maskedIdentifier = useMemo(() => maskEmail(displayIdentifier), [displayIdentifier]);
  const identifierIsValid = useMemo(() => isValidIdentifier(rawIdentifier), [rawIdentifier]);

  const inputsRef = useRef<(TextInput | null)[]>([]);
  const submitLockedRef = useRef(false);

  const [otp, setOtp] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [resendSeconds, setResendSeconds] = useState(RESEND_COOLDOWN_SECONDS);

  const { verifyOtp, verifyOtpLoading, verifyOtpError } = useAuth();

  const otpValue = useMemo(() => otp.join(""), [otp]);

  const canSubmit = useMemo(() => {
    return (
      identifierIsValid &&
      otpValue.length === OTP_LENGTH &&
      new RegExp(`^\\d{${OTP_LENGTH}}$`).test(otpValue) &&
      !verifyOtpLoading
    );
  }, [identifierIsValid, otpValue, verifyOtpLoading]);

  const canResend = resendSeconds <= 0 && !verifyOtpLoading;

  useEffect(() => {
    if (resendSeconds <= 0) return undefined;

    const timerId = setInterval(() => {
      setResendSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [resendSeconds]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      inputsRef.current[0]?.focus();
    }, 250);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  const resetOtp = useCallback(() => {
    setOtp(Array(OTP_LENGTH).fill(""));
    requestAnimationFrame(() => {
      inputsRef.current[0]?.focus();
    });
  }, []);

  const handleChange = useCallback((value: string, index: number) => {
    const digits = value.replace(/\D/g, "");

    if (!digits) {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    if (digits.length > 1) {
      const nextOtp = Array(OTP_LENGTH).fill("");

      digits
        .slice(0, OTP_LENGTH)
        .split("")
        .forEach((digit, digitIndex) => {
          nextOtp[digitIndex] = digit;
        });

      setOtp(nextOtp);

      const nextFocusIndex = Math.min(digits.length, OTP_LENGTH - 1);
      inputsRef.current[nextFocusIndex]?.focus();
      return;
    }

    const digit = digits.slice(-1);

    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key !== "Backspace") return;

      if (!otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
        return;
      }

      setOtp((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
    },
    [otp],
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || submitLockedRef.current) return;

    submitLockedRef.current = true;

    try {
      await verifyOtp({
        identifier: rawIdentifier.trim().toLowerCase(),
        otp: otpValue,
        purpose,
        otpToken,
        sessionId,
      });
    } catch {
      // Error ditampilkan via verifyOtpError.
    } finally {
      submitLockedRef.current = false;
    }
  }, [canSubmit, rawIdentifier, otpValue, purpose, otpToken, sessionId, verifyOtp]);

  const handleResend = useCallback(() => {
    if (!canResend) return;

    resetOtp();
    setResendSeconds(RESEND_COOLDOWN_SECONDS);
  }, [canResend, resetOtp]);

  const handleBack = useCallback(() => {
    resetOtp();
    router.back();
  }, [resetOtp]);

  const topFadeColors = useMemo(
    () => [theme.background, "rgba(0,0,0,0)"] as const,
    [theme.background],
  );

  const bottomFadeColors = useMemo(
    () => ["rgba(0,0,0,0)", theme.authCard] as const,
    [theme.authCard],
  );

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient
        colors={[...theme.splashGradient]}
        locations={[...theme.gradientLocations]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />

      <View style={styles.decorOne} />
      <View style={styles.decorTwo} />

      <ImageBackground source={appImages.otpBackground} resizeMode="cover" style={styles.hero}>
        <View style={styles.heroOverlay} />
        <LinearGradient colors={topFadeColors} style={styles.heroTopFade} />
        <LinearGradient colors={bottomFadeColors} style={styles.heroBottomFade} />
      </ImageBackground>

      <View style={styles.card}>
        <View style={styles.handle} />

        <Text style={styles.title}>Cek email Anda</Text>

        <Text style={styles.subtitle}>
          Masukkan kode OTP yang kami kirim ke{" "}
          <Text style={styles.emailText}>{maskedIdentifier}</Text>
        </Text>

        {!identifierIsValid ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              Sesi OTP tidak valid. Silakan kembali lalu login atau daftar ulang.
            </Text>
          </View>
        ) : null}

        <View style={styles.otpRow}>
          {otp.map((value, index) => (
            <TextInput
              key={`otp-${index}`}
              ref={(ref) => {
                inputsRef.current[index] = ref;
              }}
              value={value}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              maxLength={index === 0 ? OTP_LENGTH : 1}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
              selectTextOnFocus
              editable={!verifyOtpLoading && identifierIsValid}
              importantForAutofill="yes"
              returnKeyType={index === OTP_LENGTH - 1 ? "done" : "next"}
              onSubmitEditing={index === OTP_LENGTH - 1 ? handleSubmit : undefined}
              accessibilityLabel={`Input OTP digit ${index + 1}`}
              placeholderTextColor={theme.textSoft}
              cursorColor={theme.primary}
              selectionColor={theme.primaryMuted}
              style={[styles.otpInput, value ? styles.otpInputFilled : null]}
            />
          ))}
        </View>

        {verifyOtpError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{getSafeErrorMessage(verifyOtpError)}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={handleResend}
          disabled={!canResend}
          hitSlop={10}
          style={styles.resendButton}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canResend }}
        >
          <Text style={styles.resendText}>
            Tidak menerima kode?{" "}
            <Text style={[styles.resendLink, !canResend ? styles.resendLinkDisabled : null]}>
              Kirim ulang
            </Text>
          </Text>
        </Pressable>

        <Text style={styles.timerText}>
          {resendSeconds > 0
            ? `Kirim ulang dalam ${formatCountdown(resendSeconds)}`
            : "Anda bisa meminta kode baru."}
        </Text>

        <GradientOtpButton
          title="Selanjutnya"
          loading={verifyOtpLoading}
          disabled={!canSubmit}
          onPress={handleSubmit}
          theme={theme}
          styles={styles}
        />

        <Pressable onPress={handleBack} hitSlop={10} style={styles.backButton}>
          <Text style={styles.backText}>Kembali</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
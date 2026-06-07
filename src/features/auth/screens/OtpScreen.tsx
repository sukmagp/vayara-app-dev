import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { OTP_LENGTH } from "@/constants/app.constants";
import { appImages } from "@/constants/assets";
import { getSafeErrorMessage } from "@/utils/error.utils";

import { useAuth } from "../hooks/useAuth";
import { styles } from "../styles/OtpScreen.styles";

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

  /**
   * BE menerima identifier berupa email atau username.
   * Jadi validasi dibuat cukup ketat, tapi tidak memaksa harus email.
   */
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

export function OtpScreen() {
  const params = useLocalSearchParams<{
    identifier?: string;
    email?: string;
    purpose?: string;
  }>();

  const rawIdentifier = useMemo(() => {
    const identifierParam = getParamValue(params.identifier);
    const emailParam = getParamValue(params.email);

    /**
     * Prioritaskan identifier karena inilah yang dikirim ke BE.
     * Email hanya untuk display/fallback.
     */
    return identifierParam || emailParam;
  }, [params.identifier, params.email]);

  const displayIdentifier = useMemo(() => {
    const emailParam = getParamValue(params.email);
    return emailParam || rawIdentifier || "email anda";
  }, [params.email, rawIdentifier]);

  const maskedIdentifier = useMemo(
    () => maskEmail(displayIdentifier),
    [displayIdentifier],
  );

  const identifierIsValid = useMemo(
    () => isValidIdentifier(rawIdentifier),
    [rawIdentifier],
  );

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

  const handleChange = useCallback(
    (value: string, index: number) => {
      const digits = value.replace(/\D/g, "");

      if (!digits) {
        setOtp((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
        return;
      }

      /**
       * Support paste OTP full 6 digit dari keyboard suggestion.
       */
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
    },
    [],
  );

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
      });
    } catch {
      /**
       * Error ditampilkan via verifyOtpError dari React Query.
       * OTP tidak otomatis dihapus supaya user masih bisa koreksi kode.
       */
    } finally {
      submitLockedRef.current = false;
    }
  }, [canSubmit, rawIdentifier, otpValue, verifyOtp]);

  const handleResend = useCallback(() => {
    if (!canResend) return;

    /**
     * Postman BE belum menyediakan endpoint resend OTP.
     * Untuk sekarang tombol ini hanya reset input + cooldown FE.
     * Kalau BE sudah tambah endpoint resend, panggil mutation resend di sini.
     */
    resetOtp();
    setResendSeconds(RESEND_COOLDOWN_SECONDS);
  }, [canResend, resetOtp]);

  const handleBack = useCallback(() => {
    resetOtp();
    router.back();
  }, [resetOtp]);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={appImages.otpBackground}
        resizeMode="cover"
        style={styles.hero}
      >
      </ImageBackground>

      <View style={styles.card}>
        <Text style={styles.title}>Cek email Anda</Text>

        <Text style={styles.subtitle}>
          Masukkan kode OTP yang kami kirim ke{" "}
          <Text style={styles.emailText}>{maskedIdentifier}</Text>
        </Text>

        {!identifierIsValid ? (
          <Text style={styles.errorText}>
            Sesi OTP tidak valid. Silakan kembali lalu login atau daftar ulang.
          </Text>
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
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
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
              style={[styles.otpInput, value ? styles.otpInputFilled : null]}
            />
          ))}
        </View>

        {verifyOtpError ? (
          <Text style={styles.errorText}>
            {getSafeErrorMessage(verifyOtpError)}
          </Text>
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
            <Text
              style={[
                styles.resendLink,
                !canResend ? styles.resendLinkDisabled : null,
              ]}
            >
              Kirim ulang
            </Text>
          </Text>
        </Pressable>

        <Text style={styles.timerText}>
          {resendSeconds > 0
            ? `Kirim ulang dalam ${formatCountdown(resendSeconds)}`
            : "Anda bisa meminta kode baru."}
        </Text>

        <AppButton
          title="Selanjutnya"
          loading={verifyOtpLoading}
          disabled={!canSubmit}
          onPress={handleSubmit}
          style={styles.button}
        />

        <Pressable onPress={handleBack} hitSlop={10}>
          <Text style={styles.backText}>Kembali</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
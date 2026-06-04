import { useMemo, useRef, useState } from "react";
import { ImageBackground, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { AppButton } from "@/components/ui/AppButton";
import { OTP_LENGTH } from "@/constants/app.constants";
import { appImages } from "@/constants/assets";
import { colors } from "@/theme";
import { getSafeErrorMessage } from "@/utils/error.utils";
import { useAuth } from "../hooks/useAuth";
import { styles } from "../styles/OtpScreen.styles";

export function OtpScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = typeof params.email === "string" && params.email ? params.email : "guest@vayara.app";

  const inputsRef = useRef<Array<TextInput | null>>([]);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const { verifyOtp, verifyOtpLoading, verifyOtpError } = useAuth();

  const otpValue = useMemo(() => otp.join(""), [otp]);
  const canSubmit = otpValue.length === OTP_LENGTH;

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await verifyOtp({ email, otp: otpValue });
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ImageBackground source={appImages.otpBackground} resizeMode="cover" style={styles.hero}>
        <LinearGradient colors={["transparent", "rgba(255,248,236,0.92)", colors.background]} style={styles.heroOverlay} />
      </ImageBackground>

      <View style={styles.card}>
        <Text style={styles.title}>Cek email Anda</Text>
        <Text style={styles.subtitle}>
          Masukkan kode OTP yang kami kirim ke <Text style={styles.emailText}>{email}</Text>
        </Text>

        <View style={styles.otpRow}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputsRef.current[index] = ref;
              }}
              value={value}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              maxLength={1}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
              style={[styles.otpInput, value && styles.otpInputFilled]}
            />
          ))}
        </View>

        {verifyOtpError ? <Text style={styles.errorText}>{getSafeErrorMessage(verifyOtpError)}</Text> : null}

        <Text style={styles.resendText}>
          Tidak menerima kode? <Text style={styles.resendLink}>Kirim ulang</Text>
        </Text>
        <Text style={styles.timerText}>Kirim ulang dalam 00:15</Text>

        <AppButton
          title="Selanjutnya"
          loading={verifyOtpLoading}
          disabled={!canSubmit}
          onPress={handleSubmit}
          style={styles.button}
        />

        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.backText}>Kembali</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

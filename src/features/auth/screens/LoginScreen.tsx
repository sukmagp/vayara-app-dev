import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { AuthComingSoonModal } from "@/components/ui/ComingSoon/AuthComingSoonModal";
import { getSafeErrorMessage } from "@/utils/error.utils";

import { AuthShell } from "../components/AuthShell";
import { SocialAuthButton } from "../components/SocialAuthButton";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginSchema } from "../schemas/login.schema";
import { authSharedStyles as styles } from "../styles/AuthShared.styles";

const DEFAULT_LOGIN_VALUES: LoginSchema = {
  email: "",
  password: "",
};

type ComingSoonFeature = "forgot-password" | "google-login" | "apple-login";

const COMING_SOON_CONTENT: Record<
  ComingSoonFeature,
  {
    title: string;
    message: string;
    badge: string;
  }
> = {
  "forgot-password": {
    badge: "Recovery Trip",
    title: "Reset password segera hadir",
    message:
      "Fitur pemulihan akun sedang kami rapikan agar proses reset password tetap aman, simple, dan nyaman seperti itinerary liburan.",
  },
  "google-login": {
    badge: "One Tap Journey",
    title: "Login Google segera hadir",
    message:
      "Tim Vayara sedang menyiapkan login Google yang aman. Nanti kamu bisa masuk lebih cepat sebelum mulai explore trip impian.",
  },
  "apple-login": {
    badge: "Smooth Check-in",
    title: "Apple ID segera hadir",
    message:
      "Login dengan Apple ID sedang disiapkan agar pengalaman check-in akun kamu makin private, cepat, dan effortless.",
  },
};

const KEYBOARD_VERTICAL_OFFSET = Platform.select({
  ios: 24,
  android: 0,
  default: 0,
});

export function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] =
    useState<ComingSoonFeature | null>(null);

  const { login, loginLoading, loginError } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: DEFAULT_LOGIN_VALUES,
    mode: "onTouched",
  });

  const isIOS = useMemo(() => Platform.OS === "ios", []);

  const comingSoonContent = useMemo(() => {
    if (!comingSoonFeature) return null;
    return COMING_SOON_CONTENT[comingSoonFeature];
  }, [comingSoonFeature]);

  const closeComingSoon = useCallback(() => {
    setComingSoonFeature(null);
  }, []);

  const handleTogglePassword = useCallback(() => {
    setShowPassword((previousValue) => !previousValue);
  }, []);

  const handleForgotPassword = useCallback(() => {
    if (loginLoading) return;
    setComingSoonFeature("forgot-password");
  }, [loginLoading]);

  const handleGoogleLogin = useCallback(() => {
    if (loginLoading) return;
    setComingSoonFeature("google-login");
  }, [loginLoading]);

  const handleAppleLogin = useCallback(() => {
    if (loginLoading) return;
    setComingSoonFeature("apple-login");
  }, [loginLoading]);

  const handleRegister = useCallback(() => {
    if (loginLoading) return;
    router.push("/(auth)/register");
  }, [loginLoading]);

  const onSubmit = useCallback(
    async (values: LoginSchema) => {
      try {
        await login({
          identifier: values.email.trim().toLowerCase(),
          password: values.password,
        });
      } catch {
        // Error aman ditampilkan melalui loginError.
      }
    },
    [login],
  );

  const handleLoginPress = useMemo(
    () => handleSubmit(onSubmit),
    [handleSubmit, onSubmit],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={isIOS ? "padding" : "height"}
        keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET}
      >
        <TouchableWithoutFeedback
          accessible={false}
          onPress={Keyboard.dismiss}
        >
          <ScrollView
            style={styles.keyboardScrollView}
            contentContainerStyle={styles.keyboardScrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={isIOS ? "interactive" : "on-drag"}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <AuthShell
              title="Selamat Datang!"
              subtitle="Masukkan email dan password untuk memulai cerita perjalanan anda."
            >
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange, onBlur } }) => (
                  <AppInput
                    icon="mail"
                    placeholder="Email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoComplete="email"
                    textContentType="emailAddress"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loginLoading}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange, onBlur } }) => (
                  <AppInput
                    icon="lock-closed"
                    placeholder="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    textContentType="password"
                    autoComplete="current-password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loginLoading}
                    secureToggle
                    secureVisible={showPassword}
                    onToggleSecure={handleTogglePassword}
                    error={errors.password?.message}
                  />
                )}
              />

              <Pressable
                accessibilityRole="button"
                disabled={loginLoading}
                onPress={handleForgotPassword}
                hitSlop={10}
                style={styles.forgotButton}
              >
                <Text style={styles.forgotText}>Lupa password?</Text>
              </Pressable>

              {loginError ? (
                <Text style={styles.errorText}>
                  {getSafeErrorMessage(loginError)}
                </Text>
              ) : null}

              <AppButton
                title="Masuk"
                loading={loginLoading}
                disabled={loginLoading}
                onPress={handleLoginPress}
              />

              <View style={styles.dividerWrap}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Atau masuk dengan</Text>
                <View style={styles.divider} />
              </View>

              <SocialAuthButton
                icon="logo-google"
                title="Masuk dengan Google"
                disabled={loginLoading}
                onPress={handleGoogleLogin}
              />

              {isIOS ? (
                <SocialAuthButton
                  icon="logo-apple"
                  title="Masuk dengan Apple ID"
                  disabled={loginLoading}
                  onPress={handleAppleLogin}
                />
              ) : null}

              <View style={styles.bottomTextWrap}>
                <Text style={styles.bottomText}>Belum punya akun? </Text>

                <Pressable
                  accessibilityRole="button"
                  disabled={loginLoading}
                  onPress={handleRegister}
                  hitSlop={10}
                >
                  <Text style={styles.bottomLink}>Daftar disini</Text>
                </Pressable>
              </View>
            </AuthShell>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <AuthComingSoonModal
        visible={Boolean(comingSoonContent)}
        badge={comingSoonContent?.badge}
        title={comingSoonContent?.title}
        message={comingSoonContent?.message}
        onClose={closeComingSoon}
      />
    </>
  );
}
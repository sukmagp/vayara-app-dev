import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform, Pressable, Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { getSafeErrorMessage } from "@/utils/error.utils";

import { AuthComingSoonModal } from "@/components/ui/ComingSoon/AuthComingSoonModal";
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
    setComingSoonFeature("forgot-password");
  }, []);

  const handleGoogleLogin = useCallback(() => {
    setComingSoonFeature("google-login");
  }, []);

  const handleAppleLogin = useCallback(() => {
    setComingSoonFeature("apple-login");
  }, []);

  const handleRegister = useCallback(() => {
    router.push("/(auth)/register");
  }, []);

  const onSubmit = useCallback(
    async (values: LoginSchema) => {
      try {
        await login({
          identifier: values.email.trim(),
          password: values.password,
        });
      } catch {
        // Error ditampilkan dari loginError.
      }
    },
    [login],
  );
  
  return (
    <>
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
              autoComplete="password"
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
          <Text style={styles.errorText}>{getSafeErrorMessage(loginError)}</Text>
        ) : null}

        <AppButton
          title="Masuk"
          loading={loginLoading}
          disabled={loginLoading}
          onPress={handleSubmit(onSubmit)}
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
            disabled={loginLoading}
            onPress={handleRegister}
            hitSlop={10}
          >
            <Text style={styles.bottomLink}>Daftar disini</Text>
          </Pressable>
        </View>
      </AuthShell>

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
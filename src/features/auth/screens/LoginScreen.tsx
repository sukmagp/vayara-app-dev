import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  ImageBackground,
  type ImageSourcePropType,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  type TextInputProps,
  TouchableWithoutFeedback,
  useColorScheme,
  useWindowDimensions,
  View
} from "react-native";

import { AuthComingSoonModal } from "@/components/ui/ComingSoon/AuthComingSoonModal";
import { appImages } from "@/constants/assets";
import { getThemeColors } from "@/theme";
import { getSafeErrorMessage } from "@/utils/error.utils";

import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginSchema } from "../schemas/login.schema";
import { createAuthSharedStyles } from "../styles/AuthShared.styles";

const DEFAULT_LOGIN_VALUES: LoginSchema = {
  email: "",
  password: "",
};

type ComingSoonFeature = "forgot-password" | "apple-login";

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

const normalizeIdentifier = (value: string) => value.trim().toLowerCase();

const resolveAuthBackgroundImage = () => {
  const images = appImages as Record<string, ImageSourcePropType | undefined>;

  return (
    images.loginIllustration ??
    images.authBackground ??
    images.authHero ??
    images.registerIllustration ??
    images.onboardingOne ??
    images.onboarding1 ??
    images.otpBackground ??
    images.logo
  );
};

const AUTH_BACKGROUND_IMAGE = resolveAuthBackgroundImage();

type AuthTextFieldProps = TextInputProps & {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  error?: string;
  secureToggle?: boolean;
  secureVisible?: boolean;
  disabled?: boolean;
  onToggleSecure?: () => void;
  theme: ReturnType<typeof getThemeColors>;
  styles: ReturnType<typeof createAuthSharedStyles>;
};

const AuthTextField = memo(
  ({
    icon,
    value,
    error,
    secureToggle = false,
    secureVisible = false,
    disabled = false,
    onToggleSecure,
    theme,
    styles,
    multiline,
    onFocus,
    onBlur,
    ...props
  }: AuthTextFieldProps) => {
    const [focused, setFocused] = useState(false);

    const handleFocus: NonNullable<TextInputProps["onFocus"]> = useCallback(
      (event) => {
        setFocused(true);
        onFocus?.(event);
      },
      [onFocus],
    );

    const handleBlur: NonNullable<TextInputProps["onBlur"]> = useCallback(
      (event) => {
        setFocused(false);
        onBlur?.(event);
      },
      [onBlur],
    );

    return (
      <View style={styles.inputGroup}>
        <View
          style={[
            styles.inputContainer,
            focused ? styles.inputContainerFocused : null,
            error ? styles.inputContainerError : null,
            multiline ? styles.inputContainerMultiline : null,
          ]}
        >
          <View style={styles.inputIcon}>
            <Ionicons
              name={icon}
              size={20}
              color={error ? theme.danger : focused ? theme.primary : theme.textMuted}
            />
          </View>

          <TextInput
            {...props}
            value={value}
            editable={!disabled}
            multiline={multiline}
            placeholderTextColor={theme.textSoft}
            cursorColor={theme.primary}
            selectionColor={theme.primaryMuted}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[styles.textInput, multiline ? styles.textInputMultiline : null]}
          />

          {secureToggle ? (
            <Pressable
              accessibilityRole="button"
              disabled={disabled}
              onPress={onToggleSecure}
              hitSlop={8}
              style={styles.secureButton}
            >
              <Ionicons
                name={secureVisible ? "eye" : "eye-off"}
                size={21}
                color={theme.textMuted}
              />
            </Pressable>
          ) : null}
        </View>

        {error ? <Text style={styles.fieldErrorText}>{error}</Text> : null}
      </View>
    );
  },
);

AuthTextField.displayName = "AuthTextField";

type GradientAuthButtonProps = {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  theme: ReturnType<typeof getThemeColors>;
  styles: ReturnType<typeof createAuthSharedStyles>;
};

const GradientAuthButton = memo(
  ({ title, loading = false, disabled = false, onPress, theme, styles }: GradientAuthButtonProps) => {
    const isDisabled = disabled || loading;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.primaryButtonWrap,
          pressed && !isDisabled ? styles.primaryButtonPressed : null,
          isDisabled ? styles.primaryButtonDisabled : null,
        ]}
      >
        <LinearGradient
          colors={[...theme.gradientBarStops]}
          locations={[...theme.gradientBarLocations]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryButtonGradient}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.gradientBarIcon} />
          ) : (
            <Text style={styles.primaryButtonText}>{title}</Text>
          )}
        </LinearGradient>
      </Pressable>
    );
  },
);

GradientAuthButton.displayName = "GradientAuthButton";

type AuthSocialButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  disabled?: boolean;
  onPress: () => void;
  theme: ReturnType<typeof getThemeColors>;
  styles: ReturnType<typeof createAuthSharedStyles>;
};

const AuthSocialButton = memo(
  ({ icon, title, disabled = false, onPress, theme, styles }: AuthSocialButtonProps) => {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.socialButton,
          pressed && !disabled ? styles.linkPressed : null,
          disabled ? styles.actionDisabled : null,
        ]}
      >
        <Ionicons name={icon} size={22} color={theme.text} />
        <Text style={styles.socialButtonText}>{title}</Text>
      </Pressable>
    );
  },
);

AuthSocialButton.displayName = "AuthSocialButton";

export function LoginScreen() {
  const colorScheme = useColorScheme();
  const { width, height } = useWindowDimensions();

  const theme = useMemo(() => getThemeColors(colorScheme), [colorScheme]);
  const styles = useMemo(() => createAuthSharedStyles(theme, width, height), [theme, width, height]);

  const [showPassword, setShowPassword] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState<ComingSoonFeature | null>(null);

  const {
    login,
    loginLoading,
    loginError,
    loginWithGoogle,
    loginWithGoogleLoading,
    loginWithGoogleError,
  } = useAuth();

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
  const authLoading = loginLoading || loginWithGoogleLoading;
  const authError = loginError || loginWithGoogleError;

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
    if (authLoading) return;
    setComingSoonFeature("forgot-password");
  }, [authLoading]);

  const handleGoogleLogin = useCallback(async () => {
    if (authLoading) return;

    try {
      await loginWithGoogle();
    } catch {
      // Error aman ditampilkan melalui loginWithGoogleError.
    }
  }, [authLoading, loginWithGoogle]);

  const handleAppleLogin = useCallback(() => {
    if (authLoading) return;
    setComingSoonFeature("apple-login");
  }, [authLoading]);

  const handleRegister = useCallback(() => {
    if (authLoading) return;
    router.push("/(auth)/register");
  }, [authLoading]);

  const onSubmit = useCallback(
    async (values: LoginSchema) => {
      try {
        await login({
          identifier: normalizeIdentifier(values.email),
          password: values.password,
        });
      } catch {
        // Error aman ditampilkan melalui loginError.
      }
    },
    [login],
  );

  const handleLoginPress = useMemo(() => handleSubmit(onSubmit), [handleSubmit, onSubmit]);

  return (
    <>
<View style={styles.gradientRoot}>
  <ImageBackground
    source={AUTH_BACKGROUND_IMAGE}
    resizeMode="cover"
    style={styles.backgroundImage}
    imageStyle={styles.backgroundImageLayer}
  >
    <View style={styles.backgroundImageScrim} />
  </ImageBackground>

        <View style={styles.decorOne} />
        <View style={styles.decorTwo} />
        <View style={styles.decorThree} />

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={isIOS ? "padding" : "height"}
          keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET}
        >
          <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
            <ScrollView
              style={styles.keyboardScrollView}
              contentContainerStyle={styles.loginScrollContent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={isIOS ? "interactive" : "on-drag"}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.authSheet}>
                <View style={styles.sheetHandle} />

                <Text style={styles.sheetTitle}>Masuk Akun</Text>
                <Text style={styles.sheetSubtitle}>
                  Lanjutkan perjalananmu dengan akun Vayara.
                </Text>

                <View style={styles.formWrap}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { value, onChange, onBlur } }) => (
                      <AuthTextField
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
                        disabled={authLoading}
                        error={errors.email?.message}
                        theme={theme}
                        styles={styles}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { value, onChange, onBlur } }) => (
                      <AuthTextField
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
                        disabled={authLoading}
                        secureToggle
                        secureVisible={showPassword}
                        onToggleSecure={handleTogglePassword}
                        error={errors.password?.message}
                        theme={theme}
                        styles={styles}
                      />
                    )}
                  />

                  <Pressable
                    accessibilityRole="button"
                    disabled={authLoading}
                    onPress={handleForgotPassword}
                    hitSlop={10}
                    style={({ pressed }) => [
                      styles.forgotButton,
                      pressed && !authLoading ? styles.linkPressed : null,
                      authLoading ? styles.actionDisabled : null,
                    ]}
                  >
                    <Text style={styles.forgotText}>Lupa password?</Text>
                  </Pressable>

                  {authError ? (
                    <View style={styles.errorBox}>
                      <Text style={styles.errorText}>{getSafeErrorMessage(authError)}</Text>
                    </View>
                  ) : null}

                  <GradientAuthButton
                    title="Masuk"
                    loading={loginLoading}
                    disabled={authLoading}
                    onPress={handleLoginPress}
                    theme={theme}
                    styles={styles}
                  />

                  <View style={styles.dividerWrap}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>Atau masuk dengan</Text>
                    <View style={styles.divider} />
                  </View>

                  <AuthSocialButton
                    icon="logo-google"
                    title="Masuk dengan Google"
                    disabled={authLoading}
                    onPress={handleGoogleLogin}
                    theme={theme}
                    styles={styles}
                  />

                  {isIOS ? (
                    <AuthSocialButton
                      icon="logo-apple"
                      title="Masuk dengan Apple ID"
                      disabled={authLoading}
                      onPress={handleAppleLogin}
                      theme={theme}
                      styles={styles}
                    />
                  ) : null}

                  <View style={styles.bottomTextWrap}>
                    <Text style={styles.bottomText}>Belum punya akun? </Text>

                    <Pressable
                      accessibilityRole="button"
                      disabled={authLoading}
                      onPress={handleRegister}
                      hitSlop={10}
                      style={({ pressed }) => [
                        pressed && !authLoading ? styles.linkPressed : null,
                        authLoading ? styles.actionDisabled : null,
                      ]}
                    >
                      <Text style={styles.bottomLink}>Daftar disini</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>

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
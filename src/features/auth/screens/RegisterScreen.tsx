import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useColorScheme,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
  type TextInputProps
} from "react-native";

import { AuthDatePickerField, calculateAgeFromBirthdate } from "@/components/ui/DatePicker/AppDatePicker";
import { appImages } from "@/constants/assets";
import { getThemeColors, radius, spacing, type AppThemeColors } from "@/theme";
import { getSafeErrorMessage } from "@/utils/error.utils";

import { useAuth } from "../hooks/useAuth";
import { registerSchema, type RegisterSchema } from "../schemas/register.schema";
import { createAuthSharedStyles } from "../styles/AuthShared.styles";

const DEFAULT_REGISTER_VALUES: RegisterSchema = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  jobTypeName: "",
  nameJabatan: "",
  provinceName: "",
  cityName: "",
  kecamatanName: "",
  kelurahanName: "",
  address: "",
  hobi: "",
  placeBirth: "",
  birthdate: "",
};

const KEYBOARD_VERTICAL_OFFSET = Platform.select({
  ios: 24,
  android: 0,
  default: 0,
});

const sanitizeName = (value: string, fallback: string) => {
  const safeValue = value
    .trim()
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 80);

  return safeValue || fallback;
};

const splitFullName = (fullName: string) => {
  const safeName = sanitizeName(fullName, "User");
  const parts = safeName.split(" ").filter(Boolean);

  if (parts.length <= 1) {
    return {
      firstName: parts[0] || "User",
      lastName: "Vayara",
    };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
};

const normalizeUsername = (value: string, email: string) => {
  const fromValue = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 40);

  if (fromValue.length >= 3) return fromValue;

  const fromEmail = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 40);

  if (fromEmail.length >= 3) return fromEmail;

  return `user${Date.now()}`.slice(0, 40);
};

const normalizeInputText = (value: string, maxLength = 160) => {
  return value.trim().replace(/[<>]/g, "").slice(0, maxLength);
};

const resolveAuthBackgroundImage = () => {
  const images = appImages as Record<string, ImageSourcePropType | undefined>;

  return (
    images.loginIllustration ??
    images.authBackground ??
    images.authHero ??
    images.loginBackground ??
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

const createRegisterLocalStyles = (theme: AppThemeColors) =>
  StyleSheet.create({
    sectionLabel: {
      marginTop: spacing.xs,
      color: theme.text,
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 0.2,
    },

    ageCard: {
      minHeight: 56,
      borderRadius: radius.xl,
      paddingHorizontal: 18,
      paddingVertical: 12,
      backgroundColor: theme.primaryMuted,
      borderWidth: 1,
      borderColor: theme.glassBorder,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: theme.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 2,
    },

    ageLabel: {
      color: theme.textMuted,
      fontSize: 13,
      fontWeight: "800",
    },

    ageValue: {
      color: theme.primary,
      fontSize: 15,
      fontWeight: "900",
    },
  });

export function RegisterScreen() {
  const colorScheme = useColorScheme();
  const { width, height } = useWindowDimensions();

  const theme = useMemo(() => getThemeColors(colorScheme), [colorScheme]);
  const styles = useMemo(() => createAuthSharedStyles(theme, width, height), [theme, width, height]);
  const registerStyles = useMemo(() => createRegisterLocalStyles(theme), [theme]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    registerLoading,
    registerError,
    registerWithGoogle,
    registerWithGoogleLoading,
    registerWithGoogleError,
  } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: DEFAULT_REGISTER_VALUES,
    mode: "onTouched",
  });

  const isIOS = useMemo(() => Platform.OS === "ios", []);
  const authLoading = registerLoading || registerWithGoogleLoading;
  const authError = registerError || registerWithGoogleError;

  const watchedBirthdate = useWatch({
    control,
    name: "birthdate",
  });

  const calculatedAge = useMemo(() => {
    return calculateAgeFromBirthdate(watchedBirthdate);
  }, [watchedBirthdate]);

  const handleTogglePassword = useCallback(() => {
    setShowPassword((previousValue) => !previousValue);
  }, []);

  const handleToggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword((previousValue) => !previousValue);
  }, []);

  const handleLogin = useCallback(() => {
    if (authLoading) return;
    router.replace("/(auth)/login");
  }, [authLoading]);

  const handleGoogleRegister = useCallback(async () => {
    if (authLoading) return;

    try {
      await registerWithGoogle();
    } catch {
      // Error aman ditampilkan melalui registerWithGoogleError.
    }
  }, [authLoading, registerWithGoogle]);

  const onSubmit = useCallback(
    async (values: RegisterSchema) => {
      try {
        const email = values.email.trim().toLowerCase();
        const username = normalizeUsername(values.username, email);
        const { firstName, lastName } = splitFullName(values.fullName);

        await register({
          first_name: firstName,
          last_name: lastName,

          place_birth: normalizeInputText(values.placeBirth, 80),
          birthdate: values.birthdate,
          age: String(calculatedAge ?? 0),

          job_type_id: 1,
          job_type_name: normalizeInputText(values.jobTypeName, 80),

          province_id: 1,
          city_id: 1,
          kecamatan_id: 45,
          kelurahan_id: 27,

          address: normalizeInputText(values.address, 220),
          hobi: normalizeInputText(values.hobi, 120),

          role_id: 2,

          email,
          username,

          password: values.password,
          conf_password: values.confirmPassword,

          point_users: "0",
          is_pj: false,
          name_jabatan: normalizeInputText(values.nameJabatan, 80),
        });
      } catch {
        // Error aman ditampilkan melalui registerError.
      }
    },
    [calculatedAge, register],
  );

  const handleRegisterPress = useMemo(() => handleSubmit(onSubmit), [handleSubmit, onSubmit]);

  return (
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
            contentContainerStyle={styles.registerScrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={isIOS ? "interactive" : "on-drag"}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.registerSheet}>
              <View style={styles.sheetHandle} />

              <Text style={styles.sheetTitle}>Buat Akun Baru</Text>
              <Text style={styles.sheetSubtitle}>
                Daftar dulu, lalu verifikasi OTP untuk memulai cerita perjalanan anda.
              </Text>

              <View style={styles.formWrap}>
                <Text style={registerStyles.sectionLabel}>Informasi akun</Text>

                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <AuthTextField
                      icon="person"
                      placeholder="Nama lengkap"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoComplete="name"
                      textContentType="name"
                      autoCapitalize="words"
                      autoCorrect={false}
                      disabled={authLoading}
                      error={errors.fullName?.message}
                      theme={theme}
                      styles={styles}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="username"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <AuthTextField
                      icon="at"
                      placeholder="Username"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="none"
                      autoCorrect={false}
                      disabled={authLoading}
                      error={errors.username?.message}
                      theme={theme}
                      styles={styles}
                    />
                  )}
                />

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
                      textContentType="newPassword"
                      autoComplete="new-password"
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

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <AuthTextField
                      icon="shield-checkmark"
                      placeholder="Konfirmasi password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showConfirmPassword}
                      textContentType="newPassword"
                      autoComplete="new-password"
                      autoCapitalize="none"
                      autoCorrect={false}
                      disabled={authLoading}
                      secureToggle
                      secureVisible={showConfirmPassword}
                      onToggleSecure={handleToggleConfirmPassword}
                      error={errors.confirmPassword?.message}
                      theme={theme}
                      styles={styles}
                    />
                  )}
                />

                <Text style={registerStyles.sectionLabel}>Informasi profil</Text>

                <Controller
                  control={control}
                  name="jobTypeName"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <AuthTextField
                      icon="briefcase"
                      placeholder="Nama pekerjaan"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      autoCorrect={false}
                      disabled={authLoading}
                      error={errors.jobTypeName?.message}
                      theme={theme}
                      styles={styles}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="nameJabatan"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <AuthTextField
                      icon="ribbon"
                      placeholder="Jabatan"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      autoCorrect={false}
                      disabled={authLoading}
                      error={errors.nameJabatan?.message}
                      theme={theme}
                      styles={styles}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="placeBirth"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <AuthTextField
                      icon="location"
                      placeholder="Tempat lahir"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      autoCorrect={false}
                      disabled={authLoading}
                      error={errors.placeBirth?.message}
                      theme={theme}
                      styles={styles}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="birthdate"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <AuthDatePickerField
                      icon="calendar-outline"
                      placeholder="Pilih tanggal lahir"
                      value={value}
                      maximumDate={new Date()}
                      disabled={authLoading}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={errors.birthdate?.message}
                    />
                  )}
                />

                <View style={registerStyles.ageCard}>
                  <Text style={registerStyles.ageLabel}>Umur otomatis</Text>
                  <Text style={registerStyles.ageValue}>
                    {calculatedAge === null ? "-" : `${calculatedAge} tahun`}
                  </Text>
                </View>

                <Text style={registerStyles.sectionLabel}>Alamat</Text>

                <Controller
                  control={control}
                  name="provinceName"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <AuthTextField
                      icon="map"
                      placeholder="Provinsi"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      autoCorrect={false}
                      disabled={authLoading}
                      error={errors.provinceName?.message}
                      theme={theme}
                      styles={styles}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="cityName"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <AuthTextField
                      icon="business"
                      placeholder="Kota"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      autoCorrect={false}
                      disabled={authLoading}
                      error={errors.cityName?.message}
                      theme={theme}
                      styles={styles}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="kecamatanName"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <AuthTextField
                      icon="navigate"
                      placeholder="Kecamatan"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      autoCorrect={false}
                      disabled={authLoading}
                      error={errors.kecamatanName?.message}
                      theme={theme}
                      styles={styles}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="kelurahanName"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <AuthTextField
                      icon="pin"
                      placeholder="Kelurahan"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      autoCorrect={false}
                      disabled={authLoading}
                      error={errors.kelurahanName?.message}
                      theme={theme}
                      styles={styles}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="address"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <AuthTextField
                      icon="home"
                      placeholder="Alamat lengkap"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="sentences"
                      autoCorrect={false}
                      disabled={authLoading}
                      multiline
                      error={errors.address?.message}
                      theme={theme}
                      styles={styles}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="hobi"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <AuthTextField
                      icon="sparkles"
                      placeholder="Hobi"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      autoCorrect={false}
                      disabled={authLoading}
                      error={errors.hobi?.message}
                      theme={theme}
                      styles={styles}
                    />
                  )}
                />

                {authError ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{getSafeErrorMessage(authError)}</Text>
                  </View>
                ) : null}

                <GradientAuthButton
                  title="Daftar"
                  loading={registerLoading}
                  disabled={authLoading}
                  onPress={handleRegisterPress}
                  theme={theme}
                  styles={styles}
                />

                <View style={styles.dividerWrap}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>Atau daftar dengan</Text>
                  <View style={styles.divider} />
                </View>

                <AuthSocialButton
                  icon="logo-google"
                  title="Daftar dengan Google"
                  disabled={authLoading}
                  onPress={handleGoogleRegister}
                  theme={theme}
                  styles={styles}
                />

                {isIOS ? (
                  <AuthSocialButton
                    icon="logo-apple"
                    title="Daftar dengan Apple ID"
                    disabled={authLoading}
                    onPress={handleGoogleRegister}
                    theme={theme}
                    styles={styles}
                  />
                ) : null}

                <View style={styles.bottomTextWrap}>
                  <Text style={styles.bottomText}>Sudah punya akun? </Text>

                  <Pressable
                    accessibilityRole="button"
                    disabled={authLoading}
                    onPress={handleLogin}
                    hitSlop={10}
                    style={({ pressed }) => [
                      pressed && !authLoading ? styles.linkPressed : null,
                      authLoading ? styles.actionDisabled : null,
                    ]}
                  >
                    <Text style={styles.bottomLink}>Masuk disini</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
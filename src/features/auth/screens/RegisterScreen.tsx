import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { AuthDatePickerField, calculateAgeFromBirthdate } from "@/components/ui/DatePicker/AppDatePicker";
import { getSafeErrorMessage } from "@/utils/error.utils";

import { AuthShell } from "../components/AuthShell";
import { SocialAuthButton } from "../components/SocialAuthButton";
import { useAuth } from "../hooks/useAuth";
import { registerSchema, type RegisterSchema } from "../schemas/register.schema";
import { authSharedStyles as styles } from "../styles/AuthShared.styles";

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

const splitFullName = (fullName: string) => {
  const safeName = fullName.trim().replace(/\s+/g, " ");
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

export function RegisterScreen() {
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

          place_birth: values.placeBirth.trim(),
          birthdate: values.birthdate,
          age: String(calculatedAge ?? 0),

          job_type_id: 1,
          job_type_name: values.jobTypeName.trim(),

          province_id: 1,
          city_id: 1,
          kecamatan_id: 45,
          kelurahan_id: 27,

          address: values.address.trim(),
          hobi: values.hobi.trim(),

          role_id: 2,

          email,
          username,

          password: values.password,
          conf_password: values.confirmPassword,

          point_users: "0",
          is_pj: false,
          name_jabatan: values.nameJabatan.trim(),
        });
      } catch {
        // Error aman ditampilkan melalui registerError.
      }
    },
    [calculatedAge, register],
  );

  const handleRegisterPress = useMemo(
    () => handleSubmit(onSubmit),
    [handleSubmit, onSubmit],
  );

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={isIOS ? "padding" : "height"}
      keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET}
    >
      <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.keyboardScrollView}
          contentContainerStyle={styles.keyboardScrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={isIOS ? "interactive" : "on-drag"}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <AuthShell
            title="Buat akun baru"
            subtitle="Daftar dulu, lalu verifikasi OTP untuk memulai cerita perjalanan anda."
          >
            <Controller
              control={control}
              name="fullName"
              render={({ field: { value, onChange, onBlur } }) => (
                <AppInput
                  icon="person"
                  placeholder="Nama lengkap"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoComplete="name"
                  textContentType="name"
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!authLoading}
                  error={errors.fullName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="username"
              render={({ field: { value, onChange, onBlur } }) => (
                <AppInput
                  icon="at"
                  placeholder="Username"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!authLoading}
                  error={errors.username?.message}
                />
              )}
            />

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
                  editable={!authLoading}
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
                  textContentType="newPassword"
                  autoComplete="new-password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!authLoading}
                  secureToggle
                  secureVisible={showPassword}
                  onToggleSecure={handleTogglePassword}
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange, onBlur } }) => (
                <AppInput
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
                  editable={!authLoading}
                  secureToggle
                  secureVisible={showConfirmPassword}
                  onToggleSecure={handleToggleConfirmPassword}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="jobTypeName"
              render={({ field: { value, onChange, onBlur } }) => (
                <AppInput
                  icon="briefcase"
                  placeholder="Nama pekerjaan"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!authLoading}
                  error={errors.jobTypeName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="nameJabatan"
              render={({ field: { value, onChange, onBlur } }) => (
                <AppInput
                  icon="ribbon"
                  placeholder="Jabatan"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!authLoading}
                  error={errors.nameJabatan?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="placeBirth"
              render={({ field: { value, onChange, onBlur } }) => (
                <AppInput
                  icon="location"
                  placeholder="Tempat lahir"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!authLoading}
                  error={errors.placeBirth?.message}
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

            <Controller
              control={control}
              name="provinceName"
              render={({ field: { value, onChange, onBlur } }) => (
                <AppInput
                  icon="map"
                  placeholder="Provinsi"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!authLoading}
                  error={errors.provinceName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="cityName"
              render={({ field: { value, onChange, onBlur } }) => (
                <AppInput
                  icon="business"
                  placeholder="Kota"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!authLoading}
                  error={errors.cityName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="kecamatanName"
              render={({ field: { value, onChange, onBlur } }) => (
                <AppInput
                  icon="navigate"
                  placeholder="Kecamatan"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!authLoading}
                  error={errors.kecamatanName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="kelurahanName"
              render={({ field: { value, onChange, onBlur } }) => (
                <AppInput
                  icon="pin"
                  placeholder="Kelurahan"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!authLoading}
                  error={errors.kelurahanName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="address"
              render={({ field: { value, onChange, onBlur } }) => (
                <AppInput
                  icon="home"
                  placeholder="Alamat lengkap"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="sentences"
                  autoCorrect={false}
                  editable={!authLoading}
                  error={errors.address?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="hobi"
              render={({ field: { value, onChange, onBlur } }) => (
                <AppInput
                  icon="sparkles"
                  placeholder="Hobi"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!authLoading}
                  error={errors.hobi?.message}
                />
              )}
            />

            {authError ? (
              <Text style={styles.errorText}>
                {getSafeErrorMessage(authError)}
              </Text>
            ) : null}

            <AppButton
              title="Daftar"
              loading={registerLoading}
              disabled={authLoading}
              onPress={handleRegisterPress}
            />

            <View style={styles.dividerWrap}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Atau daftar dengan</Text>
              <View style={styles.divider} />
            </View>

            <SocialAuthButton
              icon="logo-google"
              title="Daftar dengan Google"
              disabled={authLoading}
              onPress={handleGoogleRegister}
            />

            {isIOS ? (
              <SocialAuthButton
                icon="logo-apple"
                title="Daftar dengan Apple ID"
                disabled={authLoading}
              />
            ) : null}

            <View style={styles.bottomTextWrap}>
              <Text style={styles.bottomText}>Sudah punya akun? </Text>

              <Pressable
                accessibilityRole="button"
                disabled={authLoading}
                onPress={handleLogin}
                hitSlop={10}
              >
                <Text style={styles.bottomLink}>Masuk disini</Text>
              </Pressable>
            </View>
          </AuthShell>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const registerStyles = StyleSheet.create({
  ageCard: {
    minHeight: 54,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: "rgba(15, 122, 120, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(15, 122, 120, 0.14)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ageLabel: {
    color: "#667085",
    fontSize: 13,
    fontWeight: "700",
  },

  ageValue: {
    color: "#0F7A78",
    fontSize: 15,
    fontWeight: "900",
  },
});
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { getSafeErrorMessage } from "@/utils/error.utils";
import { AuthShell } from "../components/AuthShell";
import { SocialAuthButton } from "../components/SocialAuthButton";
import { useAuth } from "../hooks/useAuth";
import { registerSchema, type RegisterSchema } from "../schemas/register.schema";
import { authSharedStyles as styles } from "../styles/AuthShared.styles";

export function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, registerLoading, registerError } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterSchema) => {
    await register({
      email: values.email.trim().toLowerCase(),
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  return (
    <AuthShell
      title="Buat akun baru"
      subtitle="Buat akun baru untuk memulai rencana perjalanan anda"
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
            secureToggle
            secureVisible={showPassword}
            onToggleSecure={() => setShowPassword((prev) => !prev)}
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
            placeholder="Konfirmasi Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={!showConfirmPassword}
            textContentType="newPassword"
            autoComplete="new-password"
            secureToggle
            secureVisible={showConfirmPassword}
            onToggleSecure={() => setShowConfirmPassword((prev) => !prev)}
            error={errors.confirmPassword?.message}
          />
        )}
      />

      {registerError ? <Text style={styles.errorText}>{getSafeErrorMessage(registerError)}</Text> : null}

      <AppButton title="Daftar" loading={registerLoading} onPress={handleSubmit(onSubmit)} />

      <View style={styles.dividerWrap}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Atau daftar dengan</Text>
        <View style={styles.divider} />
      </View>

      <SocialAuthButton icon="logo-google" title="Masuk dengan Google" />
      <SocialAuthButton icon="logo-apple" title="Masuk dengan Apple ID" />

      <View style={styles.bottomTextWrap}>
        <Text style={styles.bottomText}>Sudah punya akun? </Text>
        <Pressable onPress={() => router.replace("/(auth)/login")} hitSlop={10}>
          <Text style={styles.bottomLink}>Masuk disini</Text>
        </Pressable>
      </View>
    </AuthShell>
  );
}

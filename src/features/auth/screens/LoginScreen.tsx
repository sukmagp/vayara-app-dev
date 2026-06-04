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
import { loginSchema, type LoginSchema } from "../schemas/login.schema";
import { authSharedStyles as styles } from "../styles/AuthShared.styles";

export function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginLoading, loginError } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    await login({ email: values.email.trim().toLowerCase(), password: values.password });
  };

  return (
    <AuthShell
      title="Selamat Datang!"
      subtitle="Masukkan email dan password anda untuk login ke akun anda"
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
            textContentType="password"
            autoComplete="password"
            secureToggle
            secureVisible={showPassword}
            onToggleSecure={() => setShowPassword((prev) => !prev)}
            error={errors.password?.message}
          />
        )}
      />

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/(auth)/otp")}
        hitSlop={10}
        style={styles.forgotButton}
      >
        <Text style={styles.forgotText}>Lupa password?</Text>
      </Pressable>

      {loginError ? <Text style={styles.errorText}>{getSafeErrorMessage(loginError)}</Text> : null}

      <AppButton title="Masuk" loading={loginLoading} onPress={handleSubmit(onSubmit)} />

      <View style={styles.dividerWrap}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Atau masuk dengan</Text>
        <View style={styles.divider} />
      </View>

      <SocialAuthButton icon="logo-google" title="Masuk dengan Google" />
      <SocialAuthButton icon="logo-apple" title="Masuk dengan Apple ID" />

      <View style={styles.bottomTextWrap}>
        <Text style={styles.bottomText}>Belum punya akun? </Text>
        <Pressable onPress={() => router.push("/(auth)/register")} hitSlop={10}>
          <Text style={styles.bottomLink}>Daftar disini</Text>
        </Pressable>
      </View>
    </AuthShell>
  );
}

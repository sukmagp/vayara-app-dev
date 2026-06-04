import { z } from "zod";
import { OTP_LENGTH } from "@/constants/app.constants";

export const otpSchema = z.object({
  email: z.string().trim().email("Email tidak valid."),
  otp: z
    .string()
    .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), `Kode OTP harus ${OTP_LENGTH} digit.`),
});

export type OtpSchema = z.infer<typeof otpSchema>;

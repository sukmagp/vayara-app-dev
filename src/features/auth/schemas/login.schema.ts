import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi.")
    .max(254, "Email terlalu panjang.")
    .email("Format email tidak valid."),

  password: z
    .string()
    .min(8, "Password minimal 8 karakter.")
    .max(128, "Password terlalu panjang."),
});

export type LoginSchema = z.infer<typeof loginSchema>;
import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().trim().min(1, "Email wajib diisi.").email("Format email tidak valid."),
    password: z.string().min(8, "Password minimal 8 karakter.").max(100, "Password terlalu panjang."),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Konfirmasi password tidak sama.",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

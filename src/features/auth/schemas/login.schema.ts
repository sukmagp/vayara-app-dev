import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email wajib diisi.").email("Format email tidak valid."),
  password: z.string().min(8, "Password minimal 8 karakter.").max(100, "Password terlalu panjang."),
});

export type LoginSchema = z.infer<typeof loginSchema>;

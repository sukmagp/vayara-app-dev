import { z } from "zod";

const requiredText = (field: string, min = 2, max = 120) =>
  z
    .string()
    .trim()
    .min(min, `${field} wajib diisi.`)
    .max(max, `${field} maksimal ${max} karakter.`);

const dateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal lahir wajib dipilih.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date <= today;
  }, "Tanggal lahir tidak boleh lebih dari hari ini.");

export const registerSchema = z
  .object({
    fullName: requiredText("Nama lengkap", 3, 120),

    username: z
      .string()
      .trim()
      .min(3, "Username minimal 3 karakter.")
      .max(40, "Username maksimal 40 karakter.")
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        "Username hanya boleh huruf, angka, titik, underscore, dan dash.",
      ),

    email: z
      .string()
      .trim()
      .min(1, "Email wajib diisi.")
      .email("Format email tidak valid."),

    password: z
      .string()
      .min(8, "Password minimal 8 karakter.")
      .max(128, "Password maksimal 128 karakter."),

    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi."),

    jobTypeName: requiredText("Nama pekerjaan", 2, 80),
    nameJabatan: requiredText("Jabatan", 2, 80),

    provinceName: requiredText("Provinsi", 2, 80),
    cityName: requiredText("Kota", 2, 80),
    kecamatanName: requiredText("Kecamatan", 2, 80),
    kelurahanName: requiredText("Kelurahan", 2, 80),

    address: requiredText("Alamat", 8, 220),
    hobi: requiredText("Hobi", 2, 80),

    placeBirth: requiredText("Tempat lahir", 2, 80),
    birthdate: dateSchema,
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak sama.",
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
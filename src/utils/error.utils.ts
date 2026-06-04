export type SafeError = {
  message: string;
  statusCode?: number;
};

export const getSafeErrorMessage = (error: unknown): string => {
  if (!error) return "Terjadi kesalahan. Silakan coba lagi.";

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return "Terjadi kesalahan. Silakan coba lagi.";
};

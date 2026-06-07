import { create } from "zustand";

import type { AuthResponse, AuthState } from "../types/auth.types";

type AuthActions = {
  setSession: (payload: AuthResponse) => void;
  clearSession: () => void;
  setBootstrapped: (value: boolean) => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  userId: null,
  user: null,
  isAuthenticated: false,
  isBootstrapped: false,

  setSession: ({ userId, user }) => {
    set({
      userId,
      user,
      isAuthenticated: Boolean(userId && user),
      isBootstrapped: true,
    });
  },

  clearSession: () => {
    set({
      userId: null,
      user: null,
      isAuthenticated: false,
      isBootstrapped: true,
    });
  },

  setBootstrapped: (value) => {
    set({ isBootstrapped: value });
  },
}));
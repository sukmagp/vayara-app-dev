import { create } from "zustand";
import type { AuthState, AuthUser } from "../types/auth.types";

type AuthActions = {
  setSession: (payload: { user: AuthUser; accessToken: string }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setSession: ({ user, accessToken }) => {
    set({ user, accessToken, isAuthenticated: true });
  },

  clearSession: () => {
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));

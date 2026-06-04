import * as SecureStore from "expo-secure-store";

const isValidKey = (key: string) => /^[a-zA-Z0-9._-]+$/.test(key);

export const secureStorage = Object.freeze({
  async getItem(key: string): Promise<string | null> {
    if (!isValidKey(key)) return null;

    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (!isValidKey(key)) {
      throw new Error("Invalid secure storage key.");
    }

    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
    });
  },

  async removeItem(key: string): Promise<void> {
    if (!isValidKey(key)) return;
    await SecureStore.deleteItemAsync(key);
  },
});

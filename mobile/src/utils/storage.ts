import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const storage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },

  async saveToken(token: string): Promise<void> {
    await this.setItem(TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return await this.getItem(TOKEN_KEY);
  },

  async removeToken(): Promise<void> {
    await this.removeItem(TOKEN_KEY);
  },

  async saveUser(user: any): Promise<void> {
    await this.setItem(USER_KEY, JSON.stringify(user));
  },

  async getUser(): Promise<any | null> {
    const raw = await this.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async removeUser(): Promise<void> {
    await this.removeItem(USER_KEY);
  },
};

import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AccountType = "personal" | "business";

type AuthUser = {
  username: string;
  accountType: AccountType;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (username: string, accountType: AccountType) => Promise<void>;
  logout: () => Promise<void>;
};

const AUTH_STORAGE_KEY = "event-to-all-auth";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function clearPreviousSession() {
      try {
        await SecureStore.deleteItemAsync(AUTH_STORAGE_KEY);
      } catch {
      } finally {
        setIsLoading(false);
      }
    }

    clearPreviousSession();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoggedIn: user !== null,
      isLoading,
      login: async (username, accountType) => {
        const nextUser = { username, accountType };
        await SecureStore.setItemAsync(
          AUTH_STORAGE_KEY,
          JSON.stringify(nextUser),
        );
        setUser(nextUser);
      },
      logout: async () => {
        await SecureStore.deleteItemAsync(AUTH_STORAGE_KEY);
        setUser(null);
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

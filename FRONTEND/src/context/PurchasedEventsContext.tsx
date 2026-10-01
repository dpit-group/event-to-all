import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";

import { useAuth } from "./AuthContext";
import type { Event } from "../screens/EventScreen";

export type PurchasedEvent = Event & {
  purchaseId: string;
  adultTickets?: number;
  childTickets?: number;
};

type PurchasesByUsername = Record<string, PurchasedEvent[]>;

type PurchasedEventsContextValue = {
  purchasedEvents: PurchasedEvent[];
  addPurchasedEvent: (
    event: Event,
    adultTickets: number,
    childTickets: number,
  ) => Promise<void>;
};

const STORAGE_KEY = "event-to-all-purchased-events";
const PurchasedEventsContext = createContext<
  PurchasedEventsContextValue | undefined
>(undefined);

async function readPurchases(): Promise<PurchasesByUsername> {
  const storedPurchases =
    Platform.OS === "web"
      ? localStorage.getItem(STORAGE_KEY)
      : await SecureStore.getItemAsync(STORAGE_KEY);

  return storedPurchases
    ? (JSON.parse(storedPurchases) as PurchasesByUsername)
    : {};
}

async function writePurchases(purchases: PurchasesByUsername) {
  const serialized = JSON.stringify(purchases);
  if (Platform.OS === "web") {
    localStorage.setItem(STORAGE_KEY, serialized);
    return;
  }

  await SecureStore.setItemAsync(STORAGE_KEY, serialized);
}

export function PurchasedEventsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<PurchasesByUsername>({});
  const purchasesRef = useRef<PurchasesByUsername>({});
  const restorePromise = useRef<Promise<PurchasesByUsername>>(
    Promise.resolve({}),
  );

  useEffect(() => {
    restorePromise.current = readPurchases().catch(() => ({}));
    void restorePromise.current.then((restored) => {
      purchasesRef.current = restored;
      setPurchases(restored);
    });
  }, []);

  const value = useMemo<PurchasedEventsContextValue>(
    () => ({
      purchasedEvents: user ? (purchases[user.username] ?? []) : [],
      addPurchasedEvent: async (event, adultTickets, childTickets) => {
        if (!user) {
          throw new Error("Log in before adding a ticket to your account.");
        }

        await restorePromise.current;
        const accountPurchases = purchasesRef.current[user.username] ?? [];
        const nextPurchases = {
          ...purchasesRef.current,
          [user.username]: [
            ...accountPurchases,
            {
              ...event,
              purchaseId: `${event.id}-${Date.now()}`,
              adultTickets,
              childTickets,
            },
          ],
        };

        await writePurchases(nextPurchases);
        purchasesRef.current = nextPurchases;
        setPurchases(nextPurchases);
      },
    }),
    [purchases, user],
  );

  return (
    <PurchasedEventsContext.Provider value={value}>
      {children}
    </PurchasedEventsContext.Provider>
  );
}

export function usePurchasedEvents() {
  const context = useContext(PurchasedEventsContext);
  if (!context) {
    throw new Error(
      "usePurchasedEvents must be used within PurchasedEventsProvider",
    );
  }
  return context;
}

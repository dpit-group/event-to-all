import { createContext, useContext, useMemo, useState } from "react";

import type { Event } from "../screens/EventScreen";

type FavoritesContextValue = {
  favoriteEvents: Event[];
  isFavorite: (eventId: number) => boolean;
  toggleFavorite: (event: Event) => void;
  removeFavorite: (eventId: number) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteEvents,
      isFavorite: (eventId) =>
        favoriteEvents.some((event) => event.id === eventId),
      toggleFavorite: (event) => {
        setFavoriteEvents((currentEvents) => {
          const isAlreadyFavorite = currentEvents.some(
            (currentEvent) => currentEvent.id === event.id,
          );

          return isAlreadyFavorite
            ? currentEvents.filter((currentEvent) => currentEvent.id !== event.id)
            : [...currentEvents, event];
        });
      },
      removeFavorite: (eventId) => {
        setFavoriteEvents((currentEvents) =>
          currentEvents.filter((event) => event.id !== eventId),
        );
      },
    }),
    [favoriteEvents],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }

  return context;
}

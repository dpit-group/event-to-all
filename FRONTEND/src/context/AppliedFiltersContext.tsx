import { createContext, useContext, useMemo, useState } from "react";

import type { AppliedFilters } from "../dto/AppliedFilters";

type AppliedFiltersContextValue = {
  appliedFilters: AppliedFilters | null;
  setAppliedFilters: (filters: AppliedFilters | null) => void;
  showFilteredEvents: boolean;
  setShowFilteredEvents: (showFiltered: boolean) => void;
};

const AppliedFiltersContext = createContext<
  AppliedFiltersContextValue | undefined
>(undefined);

export function AppliedFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [appliedFilters, setAppliedFilters] =
    useState<AppliedFilters | null>(null);
  const [showFilteredEvents, setShowFilteredEvents] = useState(false);
  const value = useMemo(
    () => ({
      appliedFilters,
      setAppliedFilters,
      showFilteredEvents,
      setShowFilteredEvents,
    }),
    [appliedFilters, showFilteredEvents],
  );

  return (
    <AppliedFiltersContext.Provider value={value}>
      {children}
    </AppliedFiltersContext.Provider>
  );
}

export function useAppliedFilters() {
  const context = useContext(AppliedFiltersContext);

  if (!context) {
    throw new Error(
      "useAppliedFilters must be used within AppliedFiltersProvider",
    );
  }

  return context;
}

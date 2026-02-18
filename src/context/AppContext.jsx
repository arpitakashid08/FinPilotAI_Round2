import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fallbackData } from "../data/fallbackData";
import { fetchDashboardData } from "../services/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [data, setData] = useState(fallbackData);
  const [selectedCeoId, setSelectedCeoId] = useState(fallbackData.ceos[0].id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const next = await fetchDashboardData();
        if (active) {
          setData(next);
          setSelectedCeoId(next.ceos?.[0]?.id || fallbackData.ceos[0].id);
          setError("");
        }
      } catch {
        if (active) {
          setError("Backend unavailable. Showing fallback data.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const selectedCeo = useMemo(
    () => data.ceos.find((ceo) => ceo.id === selectedCeoId) || data.ceos[0],
    [data.ceos, selectedCeoId],
  );

  const value = useMemo(
    () => ({
      data,
      loading,
      error,
      selectedCeo,
      selectedCeoId,
      setSelectedCeoId,
    }),
    [data, loading, error, selectedCeo, selectedCeoId],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppState must be used inside AppProvider");
  }
  return ctx;
}

import { useState, useEffect } from "react";
import { SavedDeal } from "@/types/deal";

const STORAGE_KEY = "dealbreaker-history";

export const useDealHistory = () => {
  const [deals, setDeals] = useState<SavedDeal[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setDeals(JSON.parse(stored));
    } catch {
      // ignore corrupt data
    }
  }, []);

  const saveDeal = (deal: Omit<SavedDeal, "id" | "date">) => {
    const newDeal: SavedDeal = {
      ...deal,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    const updated = [newDeal, ...deals];
    setDeals(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteDeal = (id: string) => {
    const updated = deals.filter((d) => d.id !== id);
    setDeals(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { deals, saveDeal, deleteDeal };
};

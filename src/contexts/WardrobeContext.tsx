import React, { createContext, useContext } from "react";
import { useWardrobe } from "@/hooks/useWardrobe";

type WardrobeContextType = ReturnType<typeof useWardrobe>;

const WardrobeContext = createContext<WardrobeContextType | null>(null);

export function WardrobeProvider({ children }: { children: React.ReactNode }) {
  const wardrobe = useWardrobe();
  return <WardrobeContext.Provider value={wardrobe}>{children}</WardrobeContext.Provider>;
}

export function useWardrobeContext() {
  const ctx = useContext(WardrobeContext);
  if (!ctx) throw new Error("useWardrobeContext must be used within WardrobeProvider");
  return ctx;
}

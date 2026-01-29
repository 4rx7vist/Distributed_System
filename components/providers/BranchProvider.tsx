"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type BranchType = "GLOBAL" | "GUAYAQUIL" | "QUITO";

interface BranchContextType {
  branch: BranchType;
  setBranch: (branch: BranchType) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const [branch, setBranch] = useState<BranchType>("GLOBAL");

  // Optional: Persist to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedBranch");
      if (saved && ["GLOBAL", "GUAYAQUIL", "QUITO"].includes(saved)) {
        setBranch(saved as BranchType);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedBranch", branch);
    }
  }, [branch]);

  return (
    <BranchContext.Provider value={{ branch, setBranch }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error("useBranch must be used within a BranchProvider");
  }
  return context;
}

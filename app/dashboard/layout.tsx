"use client";

import { useState, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import DynamicHeader from "@/components/dashboard/DynamicHeader";
import { SearchProvider } from "@/contexts/SearchContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Contexte global pour le plan
type PlanContextType = {
  activePlan: "starter" | "pro" | "business";
  simulatedPlan: "starter" | "pro" | "business";
  setSimulatedPlan: (plan: "starter" | "pro" | "business") => void;
  isDevMode: boolean;
};

const defaultContext: PlanContextType = {
  activePlan: "starter",
  simulatedPlan: "starter",
  setSimulatedPlan: () => {},
  isDevMode: false,
};

const PlanContext = createContext(defaultContext);

export const usePlan = () => useContext(PlanContext);

export default function DashboardLayout({ children }: { children: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Simulation dev toggle pour le plan
  const isDevMode = process.env.NODE_ENV === "development";
  const [simulatedPlan, setSimulatedPlan] = useState<
    "starter" | "pro" | "business"
  >("starter");
  const activePlan = isDevMode ? simulatedPlan : "starter";

  // Données factices pour le header selon le plan
  const getScanData = () => {
    switch (activePlan) {
      case "starter":
        return { remainingScans: 8, totalScans: 10 };
      case "pro":
        return { remainingScans: 47, totalScans: Infinity };
      case "business":
        return { remainingScans: 142, totalScans: Infinity };
      default:
        return { remainingScans: 5, totalScans: 10 };
    }
  };

  const { remainingScans, totalScans } = getScanData();

  return (
    <ThemeProvider>
      <SearchProvider>
        <PlanContext.Provider
          value={{ activePlan, simulatedPlan, setSimulatedPlan, isDevMode }}
        >
          <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header dynamique global */}
              <DynamicHeader
                onMenuClick={() => setSidebarOpen(true)}
                onMenuClose={() => setSidebarOpen(false)}
                isSidebarOpen={sidebarOpen}
              />

              {/* Page Content */}
              <main className="flex-1 overflow-y-auto bg-white p-4 md:p-6">
                {children}
              </main>
            </div>
          </div>
        </PlanContext.Provider>
      </SearchProvider>
    </ThemeProvider>
  );
}

"use client";

import type { ReactNode } from "react";
import { LoyaltyLayoutProvider } from "./LoyaltyDataProvider";

export default function LoyaltyLayout({ children }: { children: ReactNode }) {
  return (
    <main className="text-foreground bg-background">
      <div className="min-h-screen p-4 md:p-8">
        <LoyaltyLayoutProvider>{children}</LoyaltyLayoutProvider>
      </div>
    </main>
  );
}

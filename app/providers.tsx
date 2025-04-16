"use client";

import { useRouter } from "next/navigation";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Authenticator } from "@aws-amplify/ui-react";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <HeroUIProvider locale="es-ES" navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <Authenticator.Provider>{children}</Authenticator.Provider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

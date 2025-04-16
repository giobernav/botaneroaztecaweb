import type { Metadata } from "next";
import type { Viewport } from "next";
import { Montserrat } from "next/font/google";
import { Providers } from "./providers";
import "@aws-amplify/ui-react/styles.css";
import "react-phone-number-input/style.css";
import "./app.css";

const montserrat = Montserrat({ subsets: ["latin"] });
import ConfigureAmplifyClientSide from "@/app/components/ConfigureAmplify";
import TopNavbar from "./components/Navbar";
import { Footer } from "./components/footer";

export const metadata: Metadata = {
  title:
    "Botanero Azteca | Un rincón tradicional de México en Valdebebas, Madrid.",
  description:
    "Tapas y restaurante tradicional mexicano en el corazón de Valdebebas.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={montserrat.className}>
        <ConfigureAmplifyClientSide />
        <Providers>
          <div className="text-foreground bg-background">
            <div className="min-h-screen flex flex-col">
              <TopNavbar />
              {children}
            </div>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

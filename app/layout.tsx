import type { Metadata } from "next";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "@aws-amplify/ui-react/styles.css";
import "react-phone-number-input/style.css";
import "./app.css";

const inter = Inter({ subsets: ["latin"] });
import ConfigureAmplifyClientSide from "@/app/components/ConfigureAmplify";
import TopNavbar from "./components/Navbar";

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
    <html lang="es" className="dark">
      <body className={inter.className}>
        <Providers>
          <ConfigureAmplifyClientSide />
          <TopNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { Viewport } from "next";
import NextTopLoader from "nextjs-toploader";
import { Montserrat } from "next/font/google";
import { Providers } from "./providers";
import "@aws-amplify/ui-react/styles.css";
import "react-phone-number-input/style.css";
import "./app.css";

const montserrat = Montserrat({ subsets: ["latin"] });
import ConfigureAmplifyClientSide from "@/app/components/ConfigureAmplify";
import TopNavbar from "./components/Navbar";
import { Footer } from "./components/footer";
// import Scroll from "./components/Scroll";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.botaneroazteca.es"),
  title: "Botanero Azteca | Un rincón tradicional de México en  Madrid",
  description:
    "Tapas y restaurante tradicional mexicano en el corazón de Valdebebas.",
  openGraph: {
    title: "Botanero Azteca | Un rincón tradicional de México en Madrid",
    description:
      "Tapas y restaurante tradicional mexicano en el corazón de Valdebebas.",
    url: "https://www.botaneroazteca.es",
    siteName: "Botanero Azteca",
    images: [
      {
        url: "https://www.botaneroazteca.es/og.png", // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#3A86FF",
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
      {/* <Scroll /> */}
      <body className={montserrat.className}>
        <ConfigureAmplifyClientSide />
        <NextTopLoader color="#dc2626" />
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

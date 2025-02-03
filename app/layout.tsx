import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "@aws-amplify/ui-react/styles.css";
import "react-phone-number-input/style.css";
import "./app.css";

const inter = Inter({ subsets: ["latin"] });
import ConfigureAmplifyClientSide from "@/app/components/ConfigureAmplify";

export const metadata: Metadata = {
  title:
    "Botanero Azteca | Un rincón tradicional de México en Valdebebas, Madrid.",
  description:
    "Tapas y restaurante tradicional mexicano en el corazón de Valdebebas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <ConfigureAmplifyClientSide>{children}</ConfigureAmplifyClientSide>
        </Providers>
      </body>
    </html>
  );
}

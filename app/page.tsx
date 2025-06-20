"use client";

import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { Header } from "./components/header";
import { MenuSection } from "./components/menu-section";
import { SpecialsSection } from "./components/specials-section";
import { ReservationSection } from "./components/reservation-section";
import { LoyaltySection } from "./components/loyalty-section";

export default function App() {
  return (
    <main>
      <Header />

      <section id="about" className="py-16 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Nosotros</h2>
            <p className="text-lg mb-4">
              Bienvenido a Botanero Azteca, donde las antiguas tradiciones
              culinarias aztecas se fusionan con los sabores modernos de México.
              Fundado en 2024, nuestro restaurante sirve auténticas botanas y
              platillos tradicionales que celebran la rica herencia de la cocina
              mexicana.
            </p>
            <p className="text-lg">
              Nuestros chefs utilizan únicamente los ingredientes más frescos,
              combinando recetas tradicionales con técnicas innovadoras para
              crear una experiencia gastronómica inolvidable que te transportará
              al corazón de México.
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              alt="Restaurant interior"
              src="/botanero-fachada-min.jpg"
              className="rounded-lg w-full shadow-lg"
            />
          </div>
        </div>
      </section>

      <Divider className="max-w-6xl mx-auto" />

      <MenuSection />

      <Divider className="max-w-6xl mx-auto" />

      <SpecialsSection />

      <Divider className="max-w-6xl mx-auto" />

      <ReservationSection />

      <Divider className="max-w-6xl mx-auto" />

      <LoyaltySection />
    </main>
  );
}

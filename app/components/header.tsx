import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export const Header = () => {
  return (
    <div
      className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("/cover-botanero.jpg")',
      }}
    >
      <div className="text-center text-white px-4 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Botanero Azteca</h1>
        <p className="text-xl md:text-2xl mb-8">
          Experimente la auténtica cocina mexicana. El auténtico mexicano de
          Valdebebas, Madrid.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            color="warning"
            size="lg"
            as="a"
            href="#menu"
            className="font-medium"
          >
            <Icon icon="lucide:menu" className="mr-2" />
            Ver nuestra carta
          </Button>
          <Button
            color="default"
            variant="bordered"
            size="lg"
            as="a"
            href="#reservation"
            className="text-white border-white font-medium"
          >
            <Icon icon="lucide:calendar" className="mr-2" />
            Hacer una reserva
          </Button>
        </div>
      </div>
    </div>
  );
};

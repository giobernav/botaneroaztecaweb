import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Icon } from "@iconify/react";
import Link from "next/link";

const menuCategories = [
  {
    id: 1,
    name: "Entrantes",
    description: "Botanas tradicionales mexicanas para empezar tu comida",
    image: "/menu/nachos.jpg",
  },
  {
    id: 2,
    name: "Principales",
    description: "Platos auténticos con sabores y especias atrevidos",
    image: "/menu/azteca.jpg",
  },
  {
    id: 3,
    name: "Postres",
    description: "Delicias dulces inspiradas en las tradiciones mexicanas",
    image: "/menu/tresleches.jpg",
  },
  {
    id: 4,
    name: "Bebidas y combinados",
    description: "Bebidas refrescantes y cócteles tradicionales.",
    image: "/menu/margarita.jpeg",
  },
];

export const MenuSection = () => {
  return (
    <section id="menu" className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Nuestra carta</h2>
        <p className="text-lg text-default-600">
          Explora nuestra amplia variedad de auténticos platos mexicanos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuCategories.map((category) => (
          <Card
            key={category.id}
            className="overflow-hidden"
            shadow="md"
            isPressable
          >
            <div className="relative h-48">
              <Image
                removeWrapper
                alt={category.name}
                className="z-0 w-full h-full object-cover"
                src={category.image}
              />
            </div>
            <CardBody className="p-4">
              <h3 className="text-xl font-bold">{category.name}</h3>
              <p className="text-default-600">{category.description}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          as={Link}
          href="https://botaneroazteca.last.shop/en/botanero-azteca"
          color="warning"
          size="lg"
          endContent={<Icon icon="lucide:arrow-right" />}
        >
          Ver la carta completa
        </Button>
      </div>
    </section>
  );
};

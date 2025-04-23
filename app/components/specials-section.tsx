import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { Icon } from "@iconify/react";

const specialDishes = [
  {
    id: 1,
    name: "Molcajete Azteca",
    description:
      "Delicioso guacamole fresco servido en un auténtico molcajete. Acompañado de queso fresco mexicano, totopos y tortillas.",
    price: "12 €",
    image: "/menu/molcajete.jpg",
    specialTag: "Chef's Special",
  },
  {
    id: 2,
    name: "Nachos especiales",
    description:
      "Totopos crujientes cubiertos con queso fundido, frijoles, guacamole, pico de gallo vibrante y carne de ternera desmechada.",
    price: "14 €",
    image: "/menu/nachos.jpg",
    specialTag: "Popular",
  },
  {
    id: 3,
    name: "Quesabirria",
    description:
      "Tres tortillas de maíz fritas rellenas de birria de res acompañadas del jugo de la carne, cebolla y cilantro.",
    price: "$14 €",
    image: "/menu/quesabirria.jpg",
    specialTag: "Traditional",
  },
];

export const SpecialsSection = () => {
  return (
    <section id="specials" className="py-16 px-4 bg-amber-50 dark:bg-amber-700">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Nuestros especiales</h2>
          <p className="text-lg text-default-600">
            Nuestros platos más populares y únicos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {specialDishes.map((dish) => (
            <Card key={dish.id} shadow="md" className="overflow-hidden">
              <div className="relative">
                <Image
                  removeWrapper
                  alt={dish.name}
                  className="w-full h-56 object-cover"
                  src={dish.image}
                />
                <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {dish.specialTag}
                </div>
              </div>
              <CardBody className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{dish.name}</h3>
                  <p className="text-lg font-semibold text-amber-600">
                    {dish.price}
                  </p>
                </div>
                <p className="text-default-600 text-sm">{dish.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Link
            className="flex items-center gap-3 text-amber-600 cursor-pointer hover:text-amber-700 transition-colors"
            href="https://botaneroazteca.last.shop/en/botanero-azteca"
          >
            <span className="font-medium">Ver todos los especiales</span>
            <Icon icon="lucide:arrow-right" width={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

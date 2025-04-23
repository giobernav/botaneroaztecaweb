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
      "Grilled steak, chicken, shrimp, and chorizo served in a hot stone bowl with cactus and cheese",
    price: "$24.99",
    image: "https://img.heroui.chat/image/food?w=300&h=300&u=mexican-molcajete",
    specialTag: "Chef's Special",
  },
  {
    id: 2,
    name: "Nachos especiales",
    description:
      "Three corn tortillas filled with chicken, topped with tomatillo sauce and queso fresco",
    price: "$18.99",
    image:
      "https://img.heroui.chat/image/food?w=300&h=300&u=mexican-enchiladas",
    specialTag: "Popular",
  },
  {
    id: 3,
    name: "Quesabirria",
    description:
      "Slow-roasted pork marinated in achiote and citrus, served with pickled red onions",
    price: "$19.99",
    image: "https://img.heroui.chat/image/food?w=300&h=300&u=mexican-cochinita",
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

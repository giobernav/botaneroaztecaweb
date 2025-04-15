import React from "react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Icon } from "@iconify/react";

const menuCategories = [
  {
    id: 1,
    name: "Appetizers",
    description: "Traditional Mexican botanas to start your meal",
    image:
      "https://img.heroui.chat/image/food?w=400&h=300&u=mexican-appetizers",
  },
  {
    id: 2,
    name: "Main Courses",
    description: "Authentic dishes with bold flavors and spices",
    image: "https://img.heroui.chat/image/food?w=400&h=300&u=mexican-mains",
  },
  {
    id: 3,
    name: "Desserts",
    description: "Sweet treats inspired by Mexican traditions",
    image: "https://img.heroui.chat/image/food?w=400&h=300&u=mexican-desserts",
  },
  {
    id: 4,
    name: "Drinks",
    description: "Refreshing beverages and traditional cocktails",
    image: "https://img.heroui.chat/image/food?w=400&h=300&u=mexican-drinks",
  },
];

export const MenuSection = () => {
  return (
    <section id="menu" className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Our Menu</h2>
        <p className="text-lg text-default-600">
          Explore our wide variety of authentic Mexican dishes
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
            {/* <CardFooter className="justify-between">
              <Button color="warning" variant="flat">
                View Items
              </Button>
            </CardFooter> */}
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          color="warning"
          size="lg"
          endContent={<Icon icon="lucide:arrow-right" />}
        >
          View Full Menu
        </Button>
      </div>
    </section>
  );
};

import React from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";

const loyaltyPerks = [
  {
    icon: "lucide:gift",
    title: "Birthday Reward",
    description: "Receive a complimentary dessert during your birthday month",
  },
  {
    icon: "lucide:percent",
    title: "Exclusive Discounts",
    description: "Get special promotions and member-only offers",
  },
  {
    icon: "lucide:star",
    title: "Earn Points",
    description: "Collect points with every purchase for future rewards",
  },
  {
    icon: "lucide:bell",
    title: "Early Access",
    description: "Be the first to know about new menu items and events",
  },
];

export const LoyaltySection = () => {
  return (
    <section
      id="loyalty"
      className="py-16 px-4 bg-gradient-to-b from-amber-100 dark:from-amber-700 to-white"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Programa de lealtad</h2>
          <p className="text-lg text-default-600 max-w-2xl mx-auto">
            Únete hoy a nuestro programa de lealtad y comienza a ganar
            recompensas con cada visita a Botanero Azteca
          </p>
        </div>

        <Card className="mb-12" shadow="md">
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/3 flex justify-center">
                <div className="relative w-64 h-40 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 p-[2px]">
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl m-[1px] p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-default-600">MIEMBRO</p>
                        <p className="text-lg font-bold mt-1">Azteca Rewards</p>
                      </div>
                      <Icon
                        icon="lucide:utensils"
                        className="text-amber-500"
                        width={24}
                      />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-default-600">DESDE 2024</p>
                        <p className="text-xs font-bold">NIVEL ORO</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold mb-3">
                  Tarjeta Azteca Rewards
                </h3>
                <p className="mb-4">
                  Regístrate en nuestro programa de fidelización y recibe una
                  tarjeta de recompensas digital que podrás usar para ganar
                  puntos con cada compra. ¡Canjea tus puntos por productos
                  gratis, descuentos y mucho más!
                </p>
                <Button
                  as={NextLink}
                  href="/loyalty"
                  color="warning"
                  endContent={<Icon icon="lucide:arrow-right" />}
                >
                  Únete ahora
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loyaltyPerks.map((perk, index) => (
            <Card key={index} className="p-4" shadow="sm">
              <CardBody className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Icon
                      icon={perk.icon}
                      className="text-amber-600"
                      width={24}
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{perk.title}</h3>
                <p className="text-default-600 text-sm">{perk.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

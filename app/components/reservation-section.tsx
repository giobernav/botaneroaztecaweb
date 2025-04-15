import React from "react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";

export const ReservationSection = () => {
  return (
    <section id="reservation" className="py-16 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">Hacer una reserva</h2>
          <p className="text-lg mb-6">
            Reserve su mesa en Botanero Azteca para una experiencia gastronómica
            inolvidable. Ya sea una ocasión especial o una reunión informal,
            estamos listos para servirle nuestra auténtica cocina mexicana.
          </p>
          <div className="mb-8">
            <h3 className="font-semibold text-xl mb-3">Horario de servicio</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Lunes</span>
                <span>Cerrado</span>
              </div>
              <div className="flex justify-between">
                <span>Martes - Jueves</span>
                <span>18:00 - 23:00</span>
              </div>
              <div className="flex justify-between">
                <span>Viernes - Sábado</span>
                <span>13:00 - 23:30</span>
              </div>
              <div className="flex justify-between">
                <span>Domingo</span>
                <span>13:00 - 22:30</span>
              </div>
              <div className="flex justify-between">
                <span>
                  El servicio de cocina termina todos los días 30 minutos antes
                  del cierre.
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              as={Link}
              color="warning"
              size="lg"
              startContent={<Icon icon="lucide:calendar" />}
              href="https://bit.ly/reservasbotanero"
            >
              Reservar mesa
            </Button>
            <Button
              as={Link}
              color="default"
              variant="bordered"
              size="lg"
              startContent={<Icon icon="mdi:whatsapp" />}
              href="https://wa.me/34671451403?text=Hola,%20Quiero%20hacer%20una%20reserva"
            >
              Escríbenos
            </Button>
          </div>
        </div>
        <div className="md:w-1/2">
          <Card className="h-full" shadow="md">
            <CardBody className="p-0 overflow-hidden">
              <div
                className="w-full h-full min-h-[350px] bg-cover bg-center"
                style={{
                  backgroundImage: 'url("/botanero-interior.jpg")',
                }}
              ></div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
};

"use client";

import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function ManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br p-4">
      <div className="max-w-md mx-auto pt-12">
        <div className="rounded-xl shadow-lg bg-default-50 p-8 space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-semibold">Programa de lealtad</h1>
            <p>
              Elija una acción a continuación para canjear las recompensas
              obtenidas o registrar una visita.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              as={Link}
              href="/management/redeem"
              color="primary"
              size="lg"
              className="w-full h-16 text-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
              startContent={<Icon icon="lucide:gift" className="text-xl" />}
            >
              Canjear recompensa
            </Button>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <Button
              as={Link}
              href="/management/register-visit"
              variant="bordered"
              color="secondary"
              size="lg"
              className="w-full h-16 text-lg shadow-md transform transition-all duration-200 hover:scale-[1.02]"
              startContent={
                <Icon icon="lucide:check-circle" className="text-xl" />
              }
            >
              Registar visita
            </Button>
          </div>

          {/* <div className="mt-6 text-center">
            <p className="text-sm">Agregar recompensa manual</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

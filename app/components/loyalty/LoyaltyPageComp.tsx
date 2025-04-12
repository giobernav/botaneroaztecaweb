"use client";

import { Card, CardBody } from "@heroui/card";
import CustomerQr from "./CustomerQr";

export default function LoyaltyPageComp({
  customerId,
}: {
  customerId: string;
}) {
  return (
    <div className="py-4">
      <div className="flex flex-col items-center">
        <Card className="max-w-md mx-auto">
          <CardBody className="flex flex-col items-center gap-4 py-8">
            <h3 className="text-lg font-semibold">Tu Código QR</h3>
            <p className="text-default-500 text-center text-sm mb-2">
              Muestra este código en el momento del pago para ganar puntos y
              canjear recompensas
            </p>

            {/* QR Code Placeholder */}
            <CustomerQr customerId={customerId} />

            <p className="text-center text-sm text-default-500">
              ID: {customerId}
            </p>
          </CardBody>
        </Card>

        <div className="mt-8 max-w-md mx-auto">
          <h4 className="text-md font-medium mb-2">¿Cómo usar tu código QR?</h4>
          <ol className="list-decimal pl-5 space-y-2 text-default-600">
            <li>Muestra tu código QR en el momento del pago</li>
            <li>Permite al camarero escanear el QR</li>
            <li>Gana puntos con cada consumo</li>
            <li>Canjea recompensas cuando tengas suficientes puntos</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

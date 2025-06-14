"use client";

import { Card, CardBody } from "@heroui/card";
import CustomerQr from "./CustomerQr";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { Link } from "@heroui/link";
import { Alert } from "@heroui/alert";
import NextLink from "next/link";

export default function LoyaltyPageComp({
  isMobile = false,
  os,
  customerId,
  passKitMemberId = "",
}: {
  isMobile?: boolean;
  os?: string | null;
  customerId: string;
  passKitMemberId?: string;
}) {
  // console.log("passKitMemberId", passKitMemberId);
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

            {/* Add to wallet button */}
            {/* https://pub1.pskt.io/{{PassKit ID}} */}
            {isMobile ? (
              <div className="flex flex-col w-full gap-3">
                <Button
                  as={Link}
                  isExternal
                  isDisabled={!passKitMemberId}
                  href={`https://pub1.pskt.io/${passKitMemberId}`}
                  color="default"
                  className="w-full"
                  startContent={
                    <Icon
                      icon={
                        os === "Android"
                          ? "logos:google-play-icon"
                          : "logos:apple"
                      }
                      width={20}
                    />
                  }
                >
                  Add to Wallet
                </Button>
              </div>
            ) : null}

            {!passKitMemberId ? (
              <div className="flex items-center justify-center w-full">
                <Alert
                  color="secondary"
                  hideIcon
                  description="Actualiza tu perfil para descargar tu tarjeta de lealtad en tu wallet."
                  endContent={
                    <Button
                      as={NextLink}
                      href="/profile"
                      color="secondary"
                      size="sm"
                      variant="flat"
                    >
                      Actualizar
                    </Button>
                  }
                  title="Agrega tu email"
                  variant="faded"
                />
              </div>
            ) : null}
          </CardBody>
        </Card>

        <div className="mt-8 max-w-md mx-auto px-2">
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

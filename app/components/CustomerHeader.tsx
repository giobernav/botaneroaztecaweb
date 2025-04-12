"use client";

import { ScrollShadow } from "@heroui/scroll-shadow";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import CustomerQr from "./CustomerQr";

export default function CustomerHeader({ customerId }: { customerId: string }) {
  const pathname = usePathname();

  return (
    <>
      <header className="mb-6 flex w-full items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-default-900 lg:text-3xl">
            Hola, Giovanny Bernal
          </h1>
          <p className="text-small text-default-400 lg:text-medium">
            Programa de recompensas
          </p>
        </div>
        <CustomerQr customerId={customerId} />
      </header>
      <ScrollShadow
        hideScrollBar
        className="-mx-2 mb-4 flex w-full justify-between gap-8"
        orientation="horizontal"
      >
        <Tabs
          aria-label="Navigation Tabs"
          classNames={{
            cursor: "bg-default-200 shadow-none",
          }}
          radius="full"
          variant="light"
          selectedKey={pathname}
        >
          <Tab
            as={NextLink}
            key="/fidelity-card"
            title="Tarjeta"
            href="/fidelity-card"
          />
          <Tab
            as={NextLink}
            key="/fidelity-card/rewards"
            title={
              <div className="flex items-center gap-2">
                <p>Recompensas</p>
                <Chip size="sm">9</Chip>
              </div>
            }
            href="/fidelity-card/rewards"
          />
          <Tab
            as={NextLink}
            key="/fidelity-card/history"
            title="Historial"
            href="/fidelity-card/history"
          />
        </Tabs>
      </ScrollShadow>
    </>
  );
}

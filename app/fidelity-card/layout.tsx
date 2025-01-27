"use client";

import { ScrollShadow } from "@heroui/scroll-shadow";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Icon } from "@iconify/react";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { BotaneroIcon } from "../components/BotaneroIcon";

import QRCode from "react-qr-code";
import { usePathname } from "next/navigation";

const FidelityCardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="w-full">
      <Navbar
        isBordered
        classNames={{
          item: "data-[active=true]:text-primary",
          wrapper: "px-4 sm:px-6",
        }}
        height="64px"
      >
        <NavbarBrand>
          <NavbarMenuToggle className="mr-2 h-6 sm:hidden" />
          <BotaneroIcon size={64} />
          {/* <p className="font-bold text-inherit">ACME</p> */}
        </NavbarBrand>

        {/* Right Menu */}
        <NavbarContent
          className="ml-auto h-12 max-w-fit items-center gap-0"
          justify="end"
        >
          {/* Theme change */}
          <NavbarItem className="lg:flex">
            <ThemeSwitcher />
          </NavbarItem>
          {/* Settings */}
          <NavbarItem className="hidden lg:flex">
            <Button isIconOnly radius="full" variant="light">
              <Icon
                className="text-default-500"
                icon="solar:settings-linear"
                width={24}
              />
            </Button>
          </NavbarItem>
          {/* User Menu */}
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly radius="full" variant="light">
                  <Icon
                    className="text-default-500"
                    icon="solar:user-linear"
                    width={24}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">johndoe@example.com</p>
                </DropdownItem>
                <DropdownItem key="settings">Mis ajustes</DropdownItem>
                <DropdownItem key="configurations">
                  Configuraciones
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Cerrar sesión
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarMenu>
          <NavbarMenuItem>
            <Link as={NextLink} className="w-full" color="foreground" href="/">
              Inicio
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem isActive>
            <Link
              as={NextLink}
              aria-current="page"
              className="w-full"
              color="primary"
              href="/fidelity-card"
            >
              Programa de recompensas
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
      <main className="mt-6 flex w-full flex-col items-center">
        <div className="w-full max-w-[1024px] px-4 lg:px-8">
          <header className="mb-6 flex w-full items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-default-900 lg:text-3xl">
                Hola, Giovanny Bernal
              </h1>
              <p className="text-small text-default-400 lg:text-medium">
                Programa de recompensas
              </p>
            </div>
            <Button
              className="bg-foreground text-background"
              startContent={
                <Icon className="flex-none" icon="lucide:qr-code" width={16} />
              }
              onPress={onOpen}
            >
              QR
            </Button>
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
          {children}
        </div>
      </main>

      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        placement="auto"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Mi código
              </ModalHeader>
              <ModalBody>
                <div className="p-4 max-w-60 w-full bg-white rounded-lg mt-0 mb-4 mx-auto">
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={JSON.stringify({
                      company: "botaneroazteca",
                      branch: "valdebebas",
                      cusid: "xx-xxxxxx-xxxxx-xxxxx",
                      // reward: null,
                      otp: "123456",
                    })}
                    viewBox={`0 0 256 256`}
                    level="Q"
                  />
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FidelityCardLayout;

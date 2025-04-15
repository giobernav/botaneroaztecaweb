"use client";
import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Icon } from "@iconify/react";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import NextLink from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";

const menuItems = [
  "Inicio",
  "Reservaciones",
  "Lealtad",
  "Mi perfil",
  "Ayuda & Comentarios",
  "Cerrar sesión",
];

export default function TopNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar isBordered maxWidth="xl" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          {/* <BotaneroIcon size={64} /> */}
          <Image src="/logo botanero chpi.png" width={64} height={64} />
          {/* <p className="font-bold text-inherit text-lg">BA</p> */}
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" as={NextLink} href="#about">
            Inicio
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" as={NextLink} href="#menu">
            Menú
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" as={NextLink} href="#specials">
            Especiales
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" as={NextLink} href="#loyalty">
            Lealtad
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            color="warning"
            href="#reservation"
            variant="flat"
            size="sm"
          >
            <Icon icon="lucide:calendar" className="mr-1" />
            Reservar
          </Button>
        </NavbarItem>
        <NavbarItem className="hidden sm:inline">
          <ThemeSwitcher />
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              as={NextLink}
              className="w-full"
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

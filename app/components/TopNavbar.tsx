"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import NextLink from "next/link";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";

import { Icon } from "@iconify/react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { BotaneroIcon } from "./BotaneroIcon";
import UserMenu from "./UserMenu";

export default function TopNavbar() {
  return (
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
        <UserMenu />
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
  );
}

"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { NavbarItem } from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const router = useRouter();

  return (
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
          <DropdownItem key="configurations">Configuraciones</DropdownItem>
          <DropdownItem
            key="logout"
            color="danger"
            onPress={async () => {
              await signOut();
              router.push("/login");
            }}
          >
            Cerrar sesión
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarItem>
  );
}

"use client";
import { useEffect, useState } from "react";
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
import { ThemeSwitcher } from "./ThemeSwitcher";
import { usePathname } from "next/navigation";
import { useHash } from "../hooks/useHash";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { Hub } from "aws-amplify/utils";

const menuItems = [
  { id: "home", label: "Inicio", path: "/" },
  {
    id: "reservation",
    label: "Hacer una reserva",
    path: "https://bit.ly/reservasbotanero",
    isExternal: true,
  },
  { id: "loyalty", label: "Programa de lealtad", path: "/loyalty" },
  { id: "profile", label: "Mi perfil", path: "/profile", authRoute: true },
  // {id: "help", label: "Ayuda & Comentarios", path: "/help"},
  { id: "signIn", label: "Iniciar sesión / Registrarse", path: "/login" },
  { id: "logout", label: "Cerrar sesión", path: undefined, authRoute: true },
];

function TopNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const hash = useHash();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  // Initialize the state based on the user object
  useEffect(() => {
    // Check if the user is authenticated on initial load
    setIsAuthenticated(!!user);
  }, [user]);

  useEffect(() => {
    // Close the menu when the pathname or hash changes
    setIsMenuOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    // Close the menu when the user logs out
    if (!user) {
      setIsMenuOpen(false);
    }
  }, [user]);

  useEffect(() => {
    // Listen for sign out events
    const unsubscribe = Hub.listen("auth", (data) => {
      const { event } = data.payload;
      console.log("Auth data:", data);
      if (event === "signedIn") {
        setIsAuthenticated(true);
      }
      if (event === "signedOut") {
        setIsAuthenticated(false);
        setIsMenuOpen(false);
        router.push("/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Navbar
      isBordered
      maxWidth="xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/">
            {/* <BotaneroIcon size={64} /> */}
            <Image src="/logo botanero chpi.png" width={64} height={64} />
            {/* <p className="font-bold text-inherit text-lg">BA</p> */}
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname === "/" && (hash === "#about" || !hash)}>
          <Link color="foreground" underline="active" href="/#about">
            Inicio
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/" && hash === "#menu"}>
          <Link color="foreground" underline="active" href="/#menu">
            Menú
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/" && hash === "#specials"}>
          <Link color="foreground" underline="active" href="/#specials">
            Especiales
          </Link>
        </NavbarItem>
        <NavbarItem
          isActive={
            (pathname === "/" && hash === "#loyalty") || pathname === "/loyalty"
          }
        >
          <Link color="foreground" underline="active" href="/#loyalty">
            Lealtad
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            showAnchorIcon
            color="warning"
            href="https://bit.ly/reservasbotanero"
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
          <NavbarMenuItem
            key={`${item.id}-${index}`}
            isActive={pathname === item.path}
            hidden={
              (!isAuthenticated && item.authRoute) ||
              (isAuthenticated && item.id === "signIn")
            }
          >
            {item.isExternal ? (
              <Link
                isExternal
                showAnchorIcon
                className="w-full"
                color="foreground"
                href={item.path}
                size="lg"
              >
                {item.label}
              </Link>
            ) : (
              <Link
                className="w-full"
                color={pathname === item.path ? "primary" : "foreground"}
                href={item.path}
                size="lg"
                onPress={
                  item.id === "logout"
                    ? () => {
                        if (signOut) {
                          signOut();
                        }
                      }
                    : undefined
                }
              >
                {item.label}
              </Link>
            )}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default TopNavbar;

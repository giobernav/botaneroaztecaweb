"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      isIconOnly
      radius="full"
      variant="light"
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Icon
        className="text-default-500"
        icon={theme === "dark" ? "solar:sun-linear" : "solar:moon-linear"}
        width={24}
      />
    </Button>
  );
}

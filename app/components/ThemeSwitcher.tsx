"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";
import { Switch } from "@heroui/switch";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Switch
      defaultSelected={theme !== "dark"}
      color="warning"
      onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      endContent={<Icon icon="solar:sun-linear" width={20} />}
      size="md"
      startContent={<Icon icon="solar:moon-linear" width={20} />}
    ></Switch>
  );
}

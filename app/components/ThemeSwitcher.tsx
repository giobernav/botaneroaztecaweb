"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";
import { Switch } from "@heroui/switch";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // The next-themes hook only resolves client-side, so wait before rendering
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || !resolvedTheme) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Switch
      isSelected={!isDark}
      color="warning"
      onChange={() => setTheme(isDark ? "light" : "dark")}
      endContent={<Icon icon="solar:sun-linear" width={20} />}
      size="md"
      startContent={<Icon icon="solar:moon-linear" width={20} />}
    ></Switch>
  );
}

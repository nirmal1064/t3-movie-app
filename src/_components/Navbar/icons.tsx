"use client";
import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeIcon() {
  const { theme, setTheme } = useTheme();

  return (
    <span
      className="cursor-pointer text-lg text-foreground"
      title="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun onClick={() => setTheme("light")} />
      ) : (
        <MoonStar onClick={() => setTheme("dark")} />
      )}
    </span>
  );
}

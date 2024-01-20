// "use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeIcon() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <span
      className="cursor-pointer text-lg text-foreground"
      title="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun onClick={() => setTheme("light")} />
      ) : (
        <Moon onClick={() => setTheme("dark")} />
      )}
    </span>
  );
}

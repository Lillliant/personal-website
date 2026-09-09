"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
type Theme = "light" | "dark";

export default function ThemeToggler() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as Theme | null;
    
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark"); // Set to dark if the user prefers dark mode
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Prevents running on the first render before the theme is set

    const root = document.documentElement;
    root.classList.remove("dark");

    if (theme === "dark") {
      root.classList.add("dark");
    }

    localStorage.setItem("app-theme", theme);
  }, [theme, mounted]);

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  };

  return (
    <button
      onClick={cycleTheme}
      className={`
        relative w-10 h-10 flex items-center justify-center rounded-full overflow-hidden transition-all duration-300
        ${
          theme === "dark"
            ? "bg-white hover:bg-zinc-200"
            : "bg-black hover:bg-zinc-500"
        }
      `}
      aria-label="Toggle theme"
    >
      {/* Sun Icon Wrapper (Active in Dark Mode) */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out transform ${
          theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      >
        <Sun className="h-5 w-5 text-zinc-950" strokeWidth={2} />
      </div>

      {/* Moon Icon Wrapper (Active in Light Mode) */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out transform ${
          theme === "dark"
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      >
        <Moon className="h-5 w-5 text-white" strokeWidth={2} />
      </div>
    </button>
  );
}

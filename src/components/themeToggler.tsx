"use client";

import { Sun, Moon } from "lucide-react";

export default function ThemeToggler() {
  const cycleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("app-theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("app-theme", "dark");
    }
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="relative w-10 h-10 flex items-center justify-center rounded-full overflow-hidden bg-black hover:bg-zinc-500 dark:bg-white dark:hover:bg-zinc-200 transition-colors duration-300 cursor-pointer"
      aria-label="Toggle theme"
    >
      {/* Sun Icon Wrapper (Active in Dark Mode) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-0 -rotate-90 dark:opacity-100 dark:scale-100 dark:rotate-0 transition-all duration-500 ease-out pointer-events-none">
        <Sun className="h-5 w-5 text-zinc-950" strokeWidth={2} />
      </div>

      {/* Moon Icon Wrapper (Active in Light Mode) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-100 scale-100 rotate-0 dark:opacity-0 dark:scale-0 dark:rotate-90 transition-all duration-500 ease-out pointer-events-none">
        <Moon className="h-5 w-5 text-white" strokeWidth={2} />
      </div>
    </button>
  );
}

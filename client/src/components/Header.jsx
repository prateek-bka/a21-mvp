import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./ui/button";

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <img src="/a21-logo.webp" alt="A21 Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-bold text-foreground">
            Elevate Intelligence
          </h1>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="relative h-9 w-9 p-0"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {/* Sun Icon for Light Mode */}
          <svg
            className={`h-4 w-4 transition-all ${
              theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>

          {/* Moon Icon for Dark Mode */}
          <svg
            className={`absolute h-4 w-4 transition-all ${
              theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </Button>
      </div>
    </header>
  );
};

export default Header;

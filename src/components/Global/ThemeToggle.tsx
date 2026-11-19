"use client";

import { Moon, Sun } from "lucide-react";
import { useLayoutEffect } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
}

export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  useLayoutEffect(() => {
    // Re-apply after React's dev remount clears the attribute set by the layout script.
    applyTheme(getStoredTheme() ?? getSystemTheme());

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (!getStoredTheme()) applyTheme(getSystemTheme());
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        applyTheme(getStoredTheme() ?? getSystemTheme());
      }
    };

    media.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  function toggle() {
    const next: Theme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Theme still changes if storage is blocked.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      title="Toggle theme"
      className={`flex size-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted ${className}`}
    >
      <Sun aria-hidden="true" className="theme-icon-sun size-4" />
      <Moon aria-hidden="true" className="theme-icon-moon size-4" />
    </button>
  );
}

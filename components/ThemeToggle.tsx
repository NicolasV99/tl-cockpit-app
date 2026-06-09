"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      className="flex rounded-[7px] overflow-hidden border"
      style={{ background: "var(--surface)", borderColor: "var(--border-strong)" }}
    >
      {(["dark", "light"] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className="px-3 py-1.5 text-[12px] font-semibold tracking-[0.4px] flex items-center gap-1.5 transition-all duration-150 cursor-pointer"
          style={
            theme === t
              ? { background: "var(--text-primary)", color: "var(--bg)" }
              : { background: "transparent", color: "var(--text-muted)" }
          }
        >
          {t === "dark" ? "🌙" : "☀️"} {t === "dark" ? "Dark" : "Light"}
        </button>
      ))}
    </div>
  );
}

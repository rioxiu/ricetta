import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { readSavedMeals } from "../lib/mealApi";

interface LayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export default function Layout({
  title = "Ricetta | Katalog Resep Masakan Internasional",
  description = "Jelajahi resep masakan dunia dengan takaran bahan jelas, langkah memasak rapi, dan daftar simpan lokal.",
  children,
}: LayoutProps) {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [savedCount, setSavedCount] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ricetta_theme") === "dark" ? "dark" : "light";
      setTheme(saved);
      if (saved === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    } catch {
      // ignore
    }

    const syncSaved = () => setSavedCount(readSavedMeals().length);
    syncSaved();
    window.addEventListener("ricetta-saved-change", syncSaved);
    window.addEventListener("storage", syncSaved);
    return () => {
      window.removeEventListener("ricetta-saved-change", syncSaved);
      window.removeEventListener("storage", syncSaved);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      localStorage.setItem("ricetta_theme", next);
    } catch {}
    if (next === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  const navItems = [
    { href: "/", label: "Beranda" },
    { href: "/meals", label: "Jelajahi Resep" },
    { href: "/saved", label: savedCount > 0 ? `Tersimpan (${savedCount})` : "Tersimpan" },
  ];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <header className="ricetta-header sticky top-0 z-40 no-print">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 min-h-[44px] no-underline"
              style={{ color: "var(--text-primary)" }}
            >
              <svg viewBox="0 0 36 36" width="32" height="32" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="34" height="34" rx="6" fill="var(--olive)" />
                <path
                  d="M12 10v16M12 10h6.2a4.3 4.3 0 0 1 0 8.6H12M16.8 18.6 23.5 26"
                  stroke="var(--olive-text-on)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="leading-tight">
                <span className="font-cookbook text-xl font-bold tracking-tight block">Ricetta</span>
                <span className="font-measure text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                  Cookbook Archive
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-1 mr-1">
                {navItems.map((item) => {
                  const active =
                    item.href === "/"
                      ? router.pathname === "/"
                      : router.pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="px-3.5 py-2 min-h-[40px] rounded-md text-sm font-medium inline-flex items-center transition-colors"
                      style={
                        active
                          ? {
                              backgroundColor: "var(--olive-subtle)",
                              color: "var(--olive)",
                              fontWeight: 700,
                            }
                          : { color: "var(--text-secondary)" }
                      }
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Ganti tema gelap atau terang"
                className="btn-parchment min-h-[40px] min-w-[40px] rounded-md inline-flex items-center justify-center"
              >
                {theme === "dark" ? (
                  <svg viewBox="0 0 18 18" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                    <circle cx="9" cy="9" r="3.6" />
                    <path
                      d="M9 1.6v1.7M9 14.7v1.7M3.8 3.8l1.2 1.2M13 13l1.2 1.2M1.6 9h1.7M14.7 9h1.7M3.8 14.2l1.2-1.2M13 5l1.2-1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 18 18" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                    <path
                      d="M14.5 10.2A6.5 6.5 0 0 1 7.8 3.5a6.6 6.6 0 1 0 6.7 6.7Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-controls="ricetta-mobile-nav"
                className="md:hidden btn-parchment px-3 min-h-[40px] rounded-md text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <span>{menuOpen ? "Tutup" : "Menu"}</span>
              </button>
            </div>
          </div>

          {menuOpen && (
            <nav
              id="ricetta-mobile-nav"
              aria-label="Navigasi seluler"
              className="md:hidden border-t px-4 py-3"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-2.5 min-h-[44px] rounded-md text-sm font-medium flex items-center"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </header>

        <main className="flex-1">{children}</main>

        <footer
          className="border-t py-8 mt-12 no-print"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm">
            <div>
              <p className="font-cookbook text-base font-bold m-0" style={{ color: "var(--text-primary)" }}>
                Ricetta
              </p>
              <p className="m-0 mt-1" style={{ color: "var(--text-muted)" }}>
                Katalog resep internasional berbasis TheMealDB API · TypeScript Edition.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-5" style={{ color: "var(--text-secondary)" }}>
              <Link href="/meals" className="hover:underline min-h-[40px] inline-flex items-center">
                Jelajahi Resep
              </Link>
              <Link href="/saved" className="hover:underline min-h-[40px] inline-flex items-center">
                Tersimpan
              </Link>
              <a
                href="https://richardosinulingga.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline min-h-[40px] inline-flex items-center"
              >
                Portofolio Richardo
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

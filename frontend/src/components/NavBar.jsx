"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const PUBLIC_LINKS = [{ href: "/", label: "Home" }];
const PRIVATE_LINKS = [
  { href: "/listing-form", label: "Post Ad" },
  { href: "/my-listings", label: "My Listings" },
  { href: "/favorites", label: "Favorites" },
  { href: "/account", label: "Account" },
];

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, ready, logout } = useAuth();

  // Close the mobile menu on navigation.
  useEffect(() => setMobileOpen(false), [pathname]);

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname === path || pathname?.startsWith(`${path}/`);

  const links = user ? [...PUBLIC_LINKS, ...PRIVATE_LINKS] : PUBLIC_LINKS;

  const linkCls = (path) =>
    `transition-colors duration-200 ${
      isActive(path) ? "text-green-700 font-semibold border-b-2 border-green-600 pb-1" : "hover:text-green-600"
    }`;

  return (
    <>
      <header className="fixed left-0 top-0 z-30 w-full bg-white/90 shadow-sm backdrop-blur-md">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-green-700 focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3" aria-label="SokoMtaani home">
              <Image src="/logo.svg" alt="SokoMtaani" width={140} height={40} className="object-contain" priority />
            </Link>

            <nav aria-label="Main" className="hidden items-center gap-8 text-base font-medium text-green-900 md:flex">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={linkCls(l.href)}
                  aria-current={isActive(l.href) ? "page" : undefined}
                >
                  {l.label}
                </Link>
              ))}
              {ready &&
                (user ? (
                  <button
                    type="button"
                    onClick={logout}
                    className="ml-2 rounded-md bg-red-600 px-4 py-2 text-white shadow-md transition-colors hover:bg-red-700"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="ml-2 flex items-center gap-3">
                    <Link href="/login" className="rounded-md px-4 py-2 text-green-800 hover:bg-green-50">
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="rounded-md bg-green-600 px-4 py-2 text-white shadow-md transition-colors hover:bg-green-700"
                    >
                      Sign up
                    </Link>
                  </div>
                ))}
            </nav>

            <button
              type="button"
              className="rounded-md p-2 text-green-800 transition-colors hover:bg-green-100 md:hidden"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>

          {mobileOpen && (
            <nav
              id="mobile-menu"
              aria-label="Main"
              className="mb-3 space-y-1 rounded-xl border border-green-100 bg-white p-2 font-medium text-green-900 shadow-lg md:hidden"
            >
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`block rounded px-4 py-2 hover:bg-green-50 ${isActive(l.href) ? "bg-green-50 font-semibold" : ""}`}
                >
                  {l.label}
                </Link>
              ))}
              {ready &&
                (user ? (
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full rounded-md bg-red-600 px-4 py-2 text-left text-white hover:bg-red-700"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link href="/login" className="block rounded px-4 py-2 hover:bg-green-50">
                      Login
                    </Link>
                    <Link href="/signup" className="block rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                      Sign up
                    </Link>
                  </>
                ))}
            </nav>
          )}
        </div>
      </header>

      {/* Spacer to push content below the fixed navbar */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}

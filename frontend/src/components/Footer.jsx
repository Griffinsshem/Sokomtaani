"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, ArrowUp } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { href: "/homepage", label: "Home" },
    { href: "/listing-form", label: "Post Ad" },
    { href: "/my-listings", label: "My Listings" },
    { href: "/favorites", label: "Favorites" },
    { href: "/login", label: "Login" },
    { href: "/signup", label: "Signup" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-10 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:justify-between gap-8">

        <div className="md:w-1/3">
          <h2 className="text-xl font-bold">SokoMtaani</h2>
          <p className="mt-2 text-sm text-gray-400">
            Your trusted local farm marketplace — connecting farmers directly with consumers to provide fresh, organic, and high-quality agricultural products.
          </p>
        </div>

        <div className="md:w-1/3">
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:w-1/3">
          <h4 className="font-semibold mb-3">Contact</h4>
          <p className="text-sm flex items-center gap-2">
            <Mail size={16} />
            <a
              href="mailto:sokomtaani@gmail.com"
              className="underline"
              aria-label="Email SokoMtaani"
            >
              sokomtaani@gmail.com
            </a>
          </p>

          <p className="text-sm mt-1 flex items-center gap-2">
            <Phone size={16} />
            <a
              href="tel:+254700000000"
              aria-label="Call SokoMtaani"
            >
              +254 700 000 000
            </a>
          </p>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} SokoMtaani. All rights reserved.</p>
        <button
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-2 text-green-500 hover:underline flex items-center gap-1 mx-auto"
        >
          <ArrowUp size={16} /> Back to Top
        </button>
      </div>
    </footer>
  );
}

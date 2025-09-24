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
    <footer className="bg-green-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="bg-green-800 p-6 rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
          <h2 className="text-2xl font-bold text-yellow-300 mb-2">SokoMtaani</h2>
          <p className="text-gray-200">
            Your trusted local farm marketplace connecting farmers directly with consumers to provide fresh, organic, and high-quality agricultural products.
          </p>
        </div>

        {/* Quick Links */}
        <div className="bg-green-800 p-6 rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-2xl flex flex-col items-center">
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-center">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-yellow-300 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>


        {/* Contact Info */}
        <div className="bg-green-800 p-6 rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
          <h3 className="font-semibold text-lg mb-2">Contact</h3>
          <p className="flex items-center gap-2 text-gray-200 mb-2">
            <Mail size={16} />
            <a href="mailto:sokomtaani@gmail.com" className="hover:text-yellow-300">
              sokomtaani@gmail.com
            </a>
          </p>
          <p className="flex items-center gap-2 text-gray-200">
            <Phone size={16} />
            <a href="tel:+254700000000" className="hover:text-yellow-300">
              +254 700 000 000
            </a>
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-700 text-center py-4 text-gray-300 text-sm">
        <p>&copy; {new Date().getFullYear()} SokoMtaani. All rights reserved.</p>
        <button
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-2 text-yellow-300 hover:text-yellow-100 flex items-center gap-1 mx-auto transition-transform hover:scale-110"
        >
          <ArrowUp size={16} /> Back to Top
        </button>
      </div>
    </footer>
  );
}

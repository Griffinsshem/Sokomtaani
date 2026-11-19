import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Heart, Home, List, Mail, MapPin, PlusSquare } from "lucide-react";

import { CONTACT_EMAIL } from "../lib/config";

const quickLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/listing-form", label: "Post Ad", icon: PlusSquare },
  { href: "/my-listings", label: "My Listings", icon: List },
  { href: "/favorites", label: "Favorites", icon: Heart },
];

export default function Footer() {
  return (
    <footer className="mt-12 bg-green-900 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 text-sm md:grid-cols-3">
        <section className="rounded-xl bg-green-800 p-6 shadow-lg" aria-labelledby="footer-about">
          <h2 id="footer-about" className="sr-only">
            About SokoMtaani
          </h2>
          <Image src="/logo.svg" alt="SokoMtaani" width={120} height={40} className="mb-3 rounded bg-white p-1" />
          <p className="mb-3 leading-relaxed text-gray-100">
            A local farm marketplace connecting farmers directly with buyers for fresh, high-quality
            agricultural products.
          </p>
          <p className="mb-4 italic text-yellow-200">&ldquo;From the farm, straight to your home.&rdquo;</p>
          <Link
            href="/listing-form"
            className="inline-block rounded-lg bg-yellow-300 px-4 py-2 font-semibold text-green-900 shadow transition-colors hover:bg-yellow-200"
          >
            Start selling
          </Link>
        </section>

        <nav className="rounded-xl bg-green-800 p-6 shadow-lg" aria-labelledby="footer-links">
          <h2 id="footer-links" className="mb-4 text-lg font-semibold text-yellow-200">
            Quick links
          </h2>
          <ul className="space-y-3">
            {quickLinks.map(({ href, label, icon: Icon }) => (
              <li key={href} className="flex items-center gap-2">
                <Icon size={16} className="text-yellow-300" aria-hidden="true" />
                <Link href={href} className="hover:text-yellow-300 hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section className="rounded-xl bg-green-800 p-6 shadow-lg" aria-labelledby="footer-contact">
          <h2 id="footer-contact" className="mb-3 text-lg font-semibold text-yellow-200">
            Contact
          </h2>
          <p className="mb-2 flex items-center gap-2 text-gray-100">
            <Mail size={16} aria-hidden="true" />
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-yellow-300 hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="flex items-center gap-2 text-gray-100">
            <MapPin size={16} aria-hidden="true" /> Nairobi, Kenya
          </p>
        </section>
      </div>

      <div className="border-t border-green-700 py-6 text-center text-sm text-gray-200">
        <p>
          &copy; {new Date().getFullYear()} SokoMtaani. All rights reserved.
          <span aria-hidden="true"> · </span>
          <Link href="/privacy-policy" className="mx-2 hover:text-yellow-300 hover:underline">
            Privacy Policy
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/terms" className="mx-2 hover:text-yellow-300 hover:underline">
            Terms of Service
          </Link>
        </p>
        <a
          href="#top"
          className="mx-auto mt-3 inline-flex items-center gap-1 text-yellow-300 hover:text-yellow-100"
        >
          <ArrowUp size={16} aria-hidden="true" /> Back to top
        </a>
      </div>
    </footer>
  );
}

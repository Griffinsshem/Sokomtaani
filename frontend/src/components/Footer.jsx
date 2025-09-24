
"use client";

import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  ArrowUp,
  Facebook,
  Twitter,
  Instagram,
  Leaf,
  Home,
  PlusSquare,
  Heart,
  List,
  LogIn,
  UserPlus,
  MapPin,
  MessageCircle,
  Clock,
} from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { href: "/homepage", label: "Home", icon: <Home size={16} /> },
    { href: "/listing-form", label: "Post Ad", icon: <PlusSquare size={16} /> },
    { href: "/my-listings", label: "My Listings", icon: <List size={16} /> },
    { href: "/favorites", label: "Favorites", icon: <Heart size={16} /> },
    { href: "/login", label: "Login", icon: <LogIn size={16} /> },
    { href: "/signup", label: "Signup", icon: <UserPlus size={16} /> },
  ];

  const socialLinks = [
    { href: "https://facebook.com", icon: <Facebook size={18} /> },
    { href: "https://twitter.com", icon: <Twitter size={18} /> },
    { href: "https://instagram.com", icon: <Instagram size={18} /> },
  ];

  return (
    <footer className="bg-green-900 text-white mt-12 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Brand */}
        <div className="bg-green-800 p-6 rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="text-yellow-300" size={28} />
            <h2 className="text-2xl font-bold text-yellow-300">SokoMtaani</h2>
          </div>
          <p className="text-gray-200 leading-relaxed mb-3">
            Your trusted local farm marketplace connecting farmers directly with
            consumers to provide fresh, organic, and high-quality agricultural
            products.
          </p>
          <p className="italic text-yellow-200 mb-4">
            “From the farm, straight to your home.”
          </p>
          <Link
            href="/listing-form"
            className="inline-block bg-yellow-300 text-green-900 font-semibold px-4 py-2 rounded-lg shadow hover:bg-yellow-200 transition-colors"
          >
            Start Selling
          </Link>
          <p className="mt-4 text-white-400 text-sm">
            Based in Nairobi, KENYA
          </p>
        </div>

        {/* Quick Links */}
        <div className="bg-green-800 p-6 rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-2xl flex flex-col items-center">
          <h3 className="font-semibold text-lg mb-4 text-yellow-200">
            Quick Links
          </h3>
          <ul className="space-y-3 text-center w-full">
            {quickLinks.map((link) => (
              <li
                key={link.href}
                className="flex items-center justify-center gap-2 group"
              >
                <span className="text-yellow-300">{link.icon}</span>
                <Link
                  href={link.href}
                  className="relative hover:text-yellow-300 transition-colors after:block after:h-[2px] after:bg-yellow-300 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="bg-green-800 p-6 rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
          <h3 className="font-semibold text-lg mb-3 text-yellow-200">Contact</h3>
          <p className="flex items-center gap-2 text-gray-200 mb-2">
            <Mail size={16} />
            <a
              href="mailto:sokomtaani@gmail.com"
              className="hover:text-yellow-300 transition-colors"
            >
              sokomtaani@gmail.com
            </a>
          </p>
          <p className="flex items-center gap-2 text-gray-200 mb-2">
            <Phone size={16} />
            <a
              href="tel:+254700000000"
              className="hover:text-yellow-300 transition-colors"
            >
              +254 700 000 000
            </a>
          </p>
          <p className="flex items-center gap-2 text-gray-200 mb-2">
            <MapPin size={16} /> Nairobi, Kenya
          </p>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-green-800/70 py-10 px-6">
        <h3 className="text-center text-yellow-300 text-xl font-semibold mb-6">
          What Our Users Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto text-sm">
          {/* Testimonial 1 */}
          <div className="bg-green-900/60 p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-transform hover:scale-105">
            <blockquote className="italic text-base text-yellow-200 leading-relaxed">
              “SokoMtaani has completely transformed how I sell my farm produce —
              now I reach more customers and earn fair prices. Truly a game
              changer for local farmers!”
            </blockquote>
            <p className="mt-3 text-gray-300 font-medium">
              — Mary W., Farmer in Nakuru
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-green-900/60 p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-transform hover:scale-105">
            <blockquote className="italic text-base text-yellow-200 leading-relaxed">
              “As a buyer, I love how easy it is to find fresh and affordable
              produce. The platform is smooth, secure, and saves me so much
              time!”
            </blockquote>
            <p className="mt-3 text-gray-300 font-medium">
              — James K., Customer in Nairobi
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-700 text-center py-6 text-gray-300 text-sm space-y-3">
        {/* Social Links */}
        <div className="flex justify-center space-x-4">
          {socialLinks.map((social, idx) => (
            <a
              key={idx}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-yellow-300 transition-colors"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Legal Links */}
        <div>
          <Link href="/privacy-policy" className="hover:text-yellow-300 mx-2">
            Privacy Policy
          </Link>
          |
          <Link href="/terms" className="hover:text-yellow-300 mx-2">
            Terms of Service
          </Link>
        </div>

        {/* Copyright */}
        <p>&copy; {new Date().getFullYear()} SokoMtaani. All rights reserved.</p>

        {/* Back to Top */}
        <button
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-yellow-300 hover:text-yellow-100 flex items-center gap-1 mx-auto transition-transform hover:scale-110"
        >
          <ArrowUp size={16} /> Back to Top
        </button>
      </div>
    </footer>
  );
}

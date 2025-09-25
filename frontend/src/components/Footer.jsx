
"use client";

import React, { useEffect, useState, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { href: "/homepage", label: "Home", icon: <Home size={16} /> },
    { href: "/listing-form", label: "Post Ad", icon: <PlusSquare size={16} /> },
    { href: "/my-listings", label: "My Listings", icon: <List size={16} /> },
    { href: "/favorites", label: "Favorites", icon: <Heart size={16} /> },
  ];

  const socialLinks = [
    { href: "https://facebook.com", icon: <Facebook size={18} /> },
    { href: "https://twitter.com", icon: <Twitter size={18} /> },
    { href: "https://instagram.com", icon: <Instagram size={18} /> },
  ];

  // --- Testimonials ---
  const testimonials = [
    {
      quote:
        "SokoMtaani has completely transformed how I sell my farm produce — now I reach more customers and earn fair prices. Truly a game changer for local farmers!",
      author: "— Mary W., Farmer in Nakuru",
    },
    {
      quote:
        "As a buyer, I love how easy it is to find fresh and affordable produce. The platform is smooth, secure, and saves me so much time!",
      author: "— James K., Customer in Nairobi",
    },
    {
      quote:
        "This platform helped me connect with farmers directly. I get fresh vegetables every week at fair prices!",
      author: "— Sarah N., Customer in Eldoret",
    },
    {
      quote:
        "Selling my produce is now so easy. No middlemen, just direct customers. My income has improved a lot.",
      author: "— Peter M., Farmer in Kisumu",
    },
    {
      quote:
        "The transparency and fairness of the platform give me peace of mind. I know I’m supporting farmers directly.",
      author: "— David O., Customer in Mombasa",
    },
    {
      quote:
        "I was struggling to find reliable markets, but SokoMtaani opened doors for me. My produce never goes to waste now!",
      author: "— Grace A., Farmer in Nyeri",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // swipe handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    }
    if (touchEndX.current - touchStartX.current > 50) {
      handlePrev();
    }
  };

  // auto rotate
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 2) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 2 + testimonials.length) % testimonials.length
    );
  };

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + 2
  );

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
        <div
          className="relative max-w-5xl mx-auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm transition-all duration-700 ease-in-out">
            {visibleTestimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-green-900/60 p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-transform hover:scale-105"
              >
                <blockquote className="italic text-base text-yellow-200 leading-relaxed">
                  “{t.quote}”
                </blockquote>
                <p className="mt-3 text-gray-300 font-medium">{t.author}</p>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-green-700 hover:bg-green-600 p-2 rounded-full shadow-md"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-green-700 hover:bg-green-600 p-2 rounded-full shadow-md"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>

          {/* Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.ceil(testimonials.length / 2) }).map(
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i * 2)}
                  className={`w-3 h-3 rounded-full ${currentIndex / 2 === i
                    ? "bg-yellow-300"
                    : "bg-gray-400 hover:bg-gray-500"
                    }`}
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar (UNCHANGED) */}
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

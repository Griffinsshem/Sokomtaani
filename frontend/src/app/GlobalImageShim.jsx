// app/providers/GlobalImageShim.jsx
"use client";
import { useEffect } from "react";

export default function GlobalImageShim({ children }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const RealImage = window.Image;
    if (typeof RealImage === "function" && !RealImage.__shim_forwarded__) {
      const Shim = function (...args) {
        return new RealImage(...args);
      };
      Shim.prototype = RealImage.prototype;
      Shim.__shim_forwarded__ = true;
      window.Image = Shim;
    }
  }, []);
  return children;
}

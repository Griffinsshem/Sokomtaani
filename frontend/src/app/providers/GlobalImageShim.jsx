"use client";
import { useEffect } from "react";

export default function GlobalImageShim({ children }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const makeShim = (Real) => {
      const Shim = function (...args) {
        return new Real(...args);
      };
      Shim.prototype = Real.prototype;
      Shim.__shim_forwarded__ = true;
      return Shim;
    };

    // apply initial shim if not already shimmed
    if (typeof window.Image === "function" && !window.Image.__shim_forwarded__) {
      window.Image = makeShim(window.Image);
      console.info("[GlobalImageShim] applied initial shim to window.Image");
    }

    try {
      const originalDesc = Object.getOwnPropertyDescriptor(window, "Image");

      Object.defineProperty(window, "Image", {
        configurable: true,
        enumerable: true,
        get() {
          return (window.__currentImage || (originalDesc && originalDesc.get && originalDesc.get()) || window.__nativeImage);
        },
        set(value) {
          console.warn("[GlobalImageShim] window.Image was overwritten!", value);
          console.warn(new Error("window.Image overwritten (stack)").stack);

          if (typeof value === "function" && !value.__shim_forwarded__) {
            const wrapped = makeShim(value);
            window.__currentImage = wrapped;
            if (!window.__nativeImage) window.__nativeImage = value;
            return;
          }
          window.__currentImage = value;
        },
      });

      const id = setInterval(() => {
        const cur = window.Image;
        if (typeof cur === "function" && !cur.__shim_forwarded__) {
          if (window.__nativeImage && window.__nativeImage !== cur) {
            console.warn("[GlobalImageShim] detected non-shim Image; wrapping and preserving native. Stack:");
            console.warn(new Error().stack);
          }
          window.Image = makeShim(cur);
        }
      }, 1000);

      return () => {
        clearInterval(id);
        try {
          if (originalDesc) Object.defineProperty(window, "Image", originalDesc);
          delete window.__currentImage;
          delete window.__nativeImage;
        } catch (e) {}
      };
    } catch (err) {
      console.error("[GlobalImageShim] failed to define watcher", err);
    }
  }, []);

  return children;
}

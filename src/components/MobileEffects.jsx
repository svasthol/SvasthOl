import React from "react";
import { motion } from "framer-motion";

export function FloatingDecor() {
  const float = {
    y: [0, -12, 0],
    rotate: [0, 4, -4, 0],
  };

  return (
    <>
      <motion.img
        src="/graphics/leaf.svg"
        alt="leaf"
        className="fixed bottom-20 left-4 w-10 opacity-30 pointer-events-none md:hidden"
        animate={float}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src="/graphics/lemon.svg"
        alt="lemon"
        className="fixed top-24 right-6 w-12 opacity-28 pointer-events-none md:hidden"
        animate={float}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
    </>
  );
}

export function GlowButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-full px-5 py-3 font-semibold shadow-lg transition-transform active:scale-95 ${className}`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-amber-300 to-emerald-600 opacity-10 blur-lg animate-pulse-slow pointer-events-none" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}

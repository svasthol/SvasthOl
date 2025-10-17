// /src/components/MobileLuxury.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * MobileLuxury.jsx
 * - Mobile-only entrance overlay for "Fresh & Modern" (emerald + citrus)
 * - Shows a short intro (3.5s) with logo + floating bubbles + shimmer
 * - Provides a "Skip" button to reveal site immediately
 * - Unmounts itself after hiding to avoid long-term overhead
 *
 * Note: Desktop (>=768px) renders nothing — your golden desktop layout stays untouched.
 */

const INTRO_DURATION_MS = 3500; // how long the intro shows before revealing site

export default function MobileLuxury() {
  const [isMobile, setIsMobile] = useState(false);
  const [show, setShow] = useState(false);
  const timerRef = useRef(null);

  // prefer-reduced-motion respect
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    // run only in client
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    // show overlay
    setShow(true);

    // auto-hide after duration (unless reduced motion)
    if (!prefersReducedMotion) {
      timerRef.current = setTimeout(() => {
        setShow(false);
      }, INTRO_DURATION_MS);
    } else {
      // if user prefers reduced motion, hide quicker
      timerRef.current = setTimeout(() => {
        setShow(false);
      }, 800);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isMobile, prefersReducedMotion]);

  // if not mobile, render nothing (keeps desktop golden version untouched)
  if (!isMobile) return null;

  // small helper to generate bubble motion variants
  const bubbleVariants = (i) => ({
    initial: { y: 0, opacity: 0.6, scale: 0.9, x: 0 },
    animate: {
      y: [0, -20 - (i % 5) * 6, 0],
      x: [0, (i % 2 ? -6 : 6) * (i % 3), 0],
      opacity: [0.6, 1, 0.6],
      scale: [0.9, 1.08, 0.95],
      transition: {
        duration: 8 + (i % 7),
        repeat: Infinity,
        ease: "easeInOut",
        delay: (i * 0.15) % 1.2,
      },
    },
  });

  // overlay animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.6 } },
  };

  const panelVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.6, ease: "easeIn" } },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="mobile-lux-overlay"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ pointerEvents: "auto" }}
        >
          {/* Backdrop (soft layered gradients + blur) */}
          <motion.div
            className="absolute inset-0"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            style={{
              background:
                "radial-gradient(1200px 600px at 10% 20%, rgba(42, 192, 152, 0.08), transparent 18%)," +
                "radial-gradient(900px 450px at 85% 80%, rgba(255, 200, 80, 0.06), transparent 20%)," +
                "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(240,253,244,0.06))",
              backdropFilter: "saturate(110%) blur(8px)",
            }}
          />

          {/* subtle shimmer band (diagonal) */}
          <motion.div
            className="absolute -inset-20 transform-gpu"
            initial={{ rotate: -8, x: "-60%" }}
            animate={{ rotate: -8, x: ["-60%", "60%"] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.02) 100%)",
              mixBlendMode: "overlay",
            }}
            aria-hidden
          />

          {/* floating juice bubbles */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 10 }).map((_, i) => {
              // randomize start positions
              const left = 6 + Math.round((i * 13) % 85);
              const top = 10 + Math.round((i * 9) % 70);
              const size = 6 + (i % 4) * 4 + (i % 3);
              const bg = i % 3 === 0 ? "rgba(110,231,183,0.12)" : "rgba(254,215,170,0.10)";
              return (
                <motion.div
                  key={`bubble-${i}`}
                  variants={bubbleVariants(i)}
                  initial="initial"
                  animate="animate"
                  className="rounded-full blur-sm"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: `${size + (i % 2 ? 0 : 4)}px`,
                    height: `${size + (i % 2 ? 0 : 4)}px`,
                    position: "absolute",
                    background: bg,
                    boxShadow: "0 6px 18px rgba(16,185,129,0.06)",
                    transformOrigin: "center",
                  }}
                />
              );
            })}
          </div>

          {/* center panel: logo + tagline */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-20 flex flex-col items-center justify-center gap-4 px-6"
            style={{ maxWidth: 520 }}
          >
            {/* glowing logo pill */}
            <motion.div
              initial={{ scale: 0.86, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: "circOut" }}
              className="rounded-full p-4"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
                boxShadow: "0 12px 30px rgba(16,185,129,0.18)",
              }}
            >
              <img
                src="/svasthol_logo.png"
                alt="Svasth Ol"
                className="w-36 h-auto sm:w-44 pointer-events-none"
                style={{ filter: "drop-shadow(0 8px 18px rgba(16,185,129,0.16))" }}
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="text-2xl font-semibold text-emerald-800 text-center leading-tight"
            >
              Natural · Trusted · Quality
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-sm text-emerald-700 text-center max-w-xs"
            >
              Fresh cold-pressed juices & authentic pulihora — crafted with love.
            </motion.p>
          </motion.div>

          {/* Skip button (small, top-right) */}
          <div className="absolute top-4 right-3 z-40">
            <button
              onClick={() => {
                if (timerRef.current) clearTimeout(timerRef.current);
                setShow(false);
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-white/90 shadow-sm text-emerald-700 backdrop-blur-sm hover:scale-95 active:scale-95 transition"
              aria-label="Skip intro and view site"
            >
              Skip
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

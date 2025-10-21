import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function MobileLuxury() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShow(true);
      document.body.style.overflow = "hidden"; // prevent background scroll/taps
      const timer = setTimeout(() => {
        setShow(false);
        document.body.style.overflow = "auto";
      }, 7000); // full 7 seconds for complete logo + blur reveal
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* 🌫️ Cinematic blurred background */}
          <motion.div
            className="absolute inset-0 backdrop-blur-3xl bg-white/10"
            animate={{ opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* 🌈 Soft glowing gradient */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-200/40 to-amber-100/30 blur-[120px]"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.7, 0.4],
              rotate: [0, 30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* 🌿 Logo Elevation */}
          <motion.img
            src="/svasthol_logo.png"
            alt="Svasth Ol Logo"
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(8px)" }}
            animate={{
              opacity: [0, 1, 1],
              y: [40, 0, -8, 0],
              scale: [0.9, 1, 1.03, 1],
              filter: ["blur(8px)", "blur(0px)"],
            }}
            transition={{ duration: 3.8, ease: "easeInOut" }}
            className="w-48 h-auto relative z-10 drop-shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          />

          {/* 🌿 Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 1.5 }}
            className="mt-6 text-emerald-800 text-lg font-medium tracking-wide relative z-10"
          >
            Natural · Trusted · Quality
          </motion.p>

          {/* ⏭️ Skip Button after 3s */}
          <motion.button
            onClick={() => {
              setShow(false);
              document.body.style.overflow = "auto";
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="absolute bottom-10 text-emerald-700 bg-white/60 backdrop-blur-md px-5 py-2 rounded-full shadow-lg font-medium hover:bg-white/80 transition"
          >
            Skip →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

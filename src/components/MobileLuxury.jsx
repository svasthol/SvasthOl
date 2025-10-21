import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function MobileLuxury() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        document.body.style.pointerEvents = "auto";
      }, 5000); // auto skip after 5s
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
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/40 backdrop-blur-2xl"
        >
          {/* Gentle floating gradient layer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-amber-50 via-emerald-50 to-yellow-50"
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating shimmer circle behind logo */}
          <motion.div
            className="absolute w-60 h-60 rounded-full bg-gradient-to-tr from-emerald-100/40 to-amber-100/40 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Logo elevation animation */}
          <motion.img
            src="/svasthol_logo.png"
            alt="Svasth Ol"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{
              opacity: [0, 1],
              y: [30, 0, -6, 0],
              scale: [0.9, 1, 1.03, 1],
            }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="w-48 h-auto relative z-10"
          />

          {/* Tagline fade-in */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1.5 }}
            className="mt-6 text-emerald-800 text-lg font-medium tracking-wide relative z-10"
          >
            Natural · Trusted · Quality
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

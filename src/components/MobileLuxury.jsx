import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function MobileLuxury() {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShow(true);

      // show skip after 3s
      const skipTimer = setTimeout(() => setShowSkip(true), 3000);

      // start fade at 5s
      const fadeTimer = setTimeout(() => setFadeOut(true), 5000);

      // remove overlay and re-enable site after 6s
      const removeTimer = setTimeout(() => {
        setShow(false);
        document.body.style.pointerEvents = "auto";
      }, 6000);

      return () => {
        clearTimeout(skipTimer);
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShow(false);
      document.body.style.pointerEvents = "auto";
    }, 400);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/60 backdrop-blur-2xl"
        >
          {/* Logo elevation */}
          <motion.img
            src="/svasthol_logo.png"
            alt="Svasth Ol"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: [40, 0, -5, 0],
              scale: [0.9, 1, 1.03, 1],
            }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="w-48 h-auto"
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: [0, 1, 1, 0], y: [15, 0, 0, -10] }}
            transition={{ duration: 4.5, delay: 1, ease: "easeInOut" }}
            className="mt-6 text-emerald-800 text-lg font-medium tracking-wide"
          >
            Natural · Trusted · Quality
          </motion.p>

          {/* Subtle background fade animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-amber-50 via-emerald-50 to-yellow-50"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Skip Button */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                onClick={handleSkip}
                className="absolute bottom-10 right-8 bg-emerald-600 text-white text-sm font-medium px-5 py-2 rounded-full shadow-md hover:bg-emerald-700 active:scale-95 transition"
              >
                Skip →
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

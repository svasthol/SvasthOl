import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function MobileLuxury() {
  const [show, setShow] = useState(false);
  const [fade, setFade] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShow(true);

      // show skip button after 3 s
      const skipTimer = setTimeout(() => setShowSkip(true), 3000);

      // begin fading out at 6 s
      const fadeTimer = setTimeout(() => setFade(true), 6000);

      // fully hide & re-enable clicks at 7.5 s
      const endTimer = setTimeout(() => {
        setShow(false);
        document.body.style.pointerEvents = "auto";
      }, 7500);

      return () => {
        clearTimeout(skipTimer);
        clearTimeout(fadeTimer);
        clearTimeout(endTimer);
      };
    }
  }, []);

  const handleSkip = () => {
    setFade(true);
    setTimeout(() => {
      setShow(false);
      document.body.style.pointerEvents = "auto";
    }, 500);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {!fade && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/70 backdrop-blur-3xl"
        >
          {/* animated gradient shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-amber-50 to-yellow-50"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              filter: [
                "blur(10px) brightness(1)",
                "blur(30px) brightness(1.1)",
                "blur(10px) brightness(1)",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ backgroundSize: "200% 200%" }}
          />

          {/* logo elevation */}
          <motion.img
            src="/svasthol_logo.png"
            alt="Svasth Ol"
            initial={{ y: 80, opacity: 0, scale: 0.9 }}
            animate={{
              y: [80, 0, -10, 0],
              opacity: [0, 1, 1, 1],
              scale: [0.9, 1, 1.05, 1],
              filter: [
                "drop-shadow(0 0 5px rgba(16,185,129,0.2))",
                "drop-shadow(0 0 20px rgba(16,185,129,0.6))",
                "drop-shadow(0 0 8px rgba(16,185,129,0.3))",
              ],
            }}
            transition={{ duration: 6, ease: "easeInOut" }}
            className="relative w-48 h-auto z-10"
          />

          {/* tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -10] }}
            transition={{ duration: 6.5, ease: "easeInOut" }}
            className="mt-8 text-emerald-800 text-lg font-medium tracking-wide relative z-10"
          >
            Natural · Trusted · Quality
          </motion.p>

          {/* shimmer layer */}
          <motion.div
            className="absolute inset-0 bg-white/40 backdrop-blur-md"
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.02, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* skip button */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                onClick={handleSkip}
                className="absolute bottom-12 right-8 bg-emerald-600 text-white text-sm font-medium px-5 py-2 rounded-full shadow-md hover:bg-emerald-700 active:scale-95 transition"
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

// /src/components/MobileLuxury.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function MobileLuxury() {
  const [show, setShow] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // detect mobile screen only
    if (window.innerWidth < 768) {
      setShow(true);
      setTimeout(() => setFade(true), 1500); // start fading after 1.5s
      setTimeout(() => {
        setShow(false);
        document.body.style.pointerEvents = "auto"; // restore interaction
      }, 2500);
    }
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {!fade && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-2xl pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.img
              src="/svasthol_logo.png"
              alt="Svasth Ol"
              className="w-48 h-auto mx-auto drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.03, 1],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 text-emerald-800 text-lg font-medium tracking-wide"
            >
              Crafted with Nature 🌿
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

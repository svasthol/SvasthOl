import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram, Youtube, Star } from "lucide-react";
import { FloatingDecor, GlowButton } from "./src/components/MobileEffects";

// Svasth Ol — React Single-File Component
// Desktop remains the same; Mobile gets upgraded smooth scrolling

const MENU = [
  { id: 1, category: 'Cold Pressed Juices', name: 'Green Detox', desc: 'Spinach, apple, lemon, ginger — cold-pressed.', price: '₹149' },
  { id: 2, category: 'Cold Pressed Juices', name: 'Citrus Boost', desc: 'Orange, carrot, lemon — vitamin C rich.', price: '₹129' },
  { id: 3, category: 'Fruit Juices', name: 'Mango Fresh', desc: 'Seasonal ripe mango blended with love.', price: '₹119' },
  { id: 4, category: 'Pulihora & Rice', name: 'Classic Pulihora', desc: 'Tangy pulihora made with traditional tempering.', price: '₹99' },
  { id: 5, category: 'Pulihora & Rice', name: 'Podi Rice Box', desc: 'Flavourful podi rice with ghee & roasted nuts.', price: '₹89' },
];

const REVIEWS = [
  { name: 'Ananya R.', stars: 5, text: 'The juices are unbelievably fresh! The Green Detox has become my daily favorite.' },
  { name: 'Ravi Kumar', stars: 4, text: 'Loved the Pulihora and Podi Rice combo — tastes like homemade with a healthy twist.' },
  { name: 'Sneha Patel', stars: 5, text: 'Perfect balance of taste and health. Their Mango Fresh is heavenly!' },
  { name: 'Suresh Varma', stars: 4, text: 'Beautifully packed and delivered on time. Highly recommend Svasth Ol!' },
];

const CATEGORIES = ['All', 'Cold Pressed Juices', 'Fruit Juices', 'Pulihora & Rice'];

export default function SvasthOlWebsite() {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? MENU : MENU.filter((m) => m.category === cat);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    const handleScroll = () => setScrolled(window.scrollY > 30);
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setOffset({ x, y });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gradient-to-b from-amber-50 via-emerald-50 to-yellow-50 animate-gradient">

      {/* 🌿 Floating Elements for Mobile */}
      <FloatingDecor />

      {/* ============================= */}
      {/* 🌿 Header */}
      {/* ============================= */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg py-2'
          : 'bg-white/60 backdrop-blur-md shadow-sm py-4'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 transition-all duration-700">
          <a href="#home" className="flex items-center gap-2 group">
            <motion.div
              className={`w-11 h-11 rounded-full border flex items-center justify-center overflow-hidden transition-all duration-700 ${
                scrolled
                  ? 'bg-white border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                  : 'bg-white border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              }`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              <img
                src="/svasthol_logo.png"
                alt="Svasth Ol Logo"
                className={`object-contain transition-all duration-700 ${
                  scrolled ? 'w-7 h-7' : 'w-8 h-8'
                }`}
              />
            </motion.div>
            <span className={`font-semibold tracking-wide transition-all duration-700 ${
              scrolled ? 'text-emerald-800 text-base' : 'text-emerald-700 text-lg'
            }`}>
              Svasth Òl
            </span>
          </a>
          <nav className={`hidden md:flex items-center gap-8 font-medium transition-all duration-700 ${
            scrolled ? 'text-emerald-700' : 'text-emerald-800'
          }`}>
            <a href="#home" className="hover:text-emerald-600 transition">Home</a>
            <a href="#about" className="hover:text-emerald-600 transition">About</a>
            <a href="#menu" className="hover:text-emerald-600 transition">Menu</a>
            <a href="#contact" className="hover:text-emerald-600 transition">Contact</a>
          </nav>
          <a href="#order"
            className={`hidden md:inline-block px-5 py-2 rounded-full font-semibold shadow-md transition-all duration-700 ${
              scrolled
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
            }`}>
            Order Now
          </a>
        </div>
      </header>

      {/* ============================= */}
      {/* 🍽️ SMOOTH MOBILE MENU SECTION */}
      {/* ============================= */}
      <section id="menu" className="mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-emerald-800">Our Menu</h3>
          <p className="mt-2 text-gray-600">Healthy choices — made fresh daily.</p>

          <div className="mt-6 flex gap-3 flex-wrap justify-center">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  cat === c
                    ? "bg-emerald-600 text-white shadow-md scale-105"
                    : "bg-white border hover:bg-emerald-50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
              md:grid-cols-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide
              md:overflow-visible md:snap-none"
            style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
          >
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ translateY: -6 }}
                className="min-w-[80%] sm:min-w-0 bg-white rounded-2xl p-5 shadow-md
                snap-center scroll-smooth flex-shrink-0 transition-all duration-500
                hover:shadow-lg hover:scale-[1.02]"
              >
                <div className="h-40 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-100 to-amber-50 flex items-center justify-center text-2xl font-semibold text-amber-700">
                  {item.name.split(" ")[0]}
                </div>
                <h4 className="mt-4 font-semibold text-lg">{item.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-emerald-600 font-bold">{item.price}</div>
                  <a
                    href={`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(`Hi Svasth Ol, I want to order ${item.name}`)}`}
                    className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm shadow hover:bg-emerald-700 active:scale-95 transition"
                  >
                    Order on WhatsApp
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ... keep the rest of your sections (About, Gallery, Reviews, Contact, Footer) unchanged ... */}

    </div>
  );
}

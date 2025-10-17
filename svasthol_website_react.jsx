// src/svasthol_website_react.jsx — Stable Version (Full Hero + Working Build)
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram, Youtube, Star } from "lucide-react";

const MENU = [
  { id: 1, category: "Cold Pressed Juices", name: "Green Detox", desc: "Spinach, apple, lemon, ginger — cold-pressed.", price: "₹149" },
  { id: 2, category: "Cold Pressed Juices", name: "Citrus Boost", desc: "Orange, carrot, lemon — vitamin C rich.", price: "₹129" },
  { id: 3, category: "Fruit Juices", name: "Mango Fresh", desc: "Seasonal ripe mango blended with love.", price: "₹119" },
  { id: 4, category: "Pulihora & Rice", name: "Classic Pulihora", desc: "Tangy pulihora made with traditional tempering.", price: "₹99" },
  { id: 5, category: "Pulihora & Rice", name: "Podi Rice Box", desc: "Flavourful podi rice with ghee & roasted nuts.", price: "₹89" },
];

const REVIEWS = [
  { name: "Ananya R.", stars: 5, text: "The juices are unbelievably fresh! The Green Detox has become my daily favorite." },
  { name: "Ravi Kumar", stars: 4, text: "Loved the Pulihora and Podi Rice combo — tastes like homemade with a healthy twist." },
  { name: "Sneha Patel", stars: 5, text: "Perfect balance of taste and health. Their Mango Fresh is heavenly!" },
  { name: "Suresh Varma", stars: 4, text: "Beautifully packed and delivered on time. Highly recommend Svasth Ol!" },
];

const CATEGORIES = ["All", "Cold Pressed Juices", "Fruit Juices", "Pulihora & Rice"];

export default function SvasthOlWebsite() {
  const [cat, setCat] = useState("All");
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setOffset({ x, y });
    };
    window.addEventListener("mousemove", handleMove);
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const filtered = cat === "All" ? MENU : MENU.filter((m) => m.category === cat);

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gradient-to-b from-amber-50 via-emerald-50 to-yellow-50">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg py-2"
            : "bg-white/60 backdrop-blur-md shadow-sm py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          <a href="#home" className="flex items-center gap-2">
            <motion.div className="w-10 h-10 rounded-full border border-emerald-200 flex items-center justify-center bg-white shadow-md">
              <img src="/svasthol_logo.png" alt="Svasth Ol Logo" className="w-7 h-7 object-contain" />
            </motion.div>
            <span className="font-semibold text-emerald-700 text-lg">Svasth Òl</span>
          </a>
          <nav className="hidden md:flex gap-6 text-emerald-800">
            <a href="#home" className="hover:text-emerald-600">Home</a>
            <a href="#menu" className="hover:text-emerald-600">Menu</a>
            <a href="#about" className="hover:text-emerald-600">About</a>
            <a href="#contact" className="hover:text-emerald-600">Contact</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="relative flex flex-col items-center justify-center min-h-screen text-center bg-white overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-amber-50 via-emerald-50 to-yellow-50"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          style={{ backgroundSize: "200% 200%" }}
        />
        <motion.img
          src="/svasthol_logo.png"
          alt="Svasth Ol Logo"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          className="w-56 sm:w-80 md:w-[26rem] h-auto mb-8 drop-shadow-[0_0_25px_rgba(16,185,129,0.3)]"
        />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-emerald-800 tracking-wide"
        >
          Natural · Trusted · Quality
        </motion.h2>
      </section>

      {/* MENU (unchanged layout) */}
      <section id="menu" className="mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-emerald-800">Our Menu</h3>
          <p className="mt-2 text-gray-600">Healthy choices — made fresh daily.</p>
          <div className="mt-6 flex gap-3 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-sm ${cat === c ? "bg-emerald-600 text-white" : "bg-white border"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <motion.div key={item.id} whileHover={{ translateY: -6 }} className="bg-white rounded-2xl p-5 shadow">
                <div className="h-40 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-100 to-amber-50 flex items-center justify-center text-2xl font-semibold text-amber-700">{item.name.split(" ")[0]}</div>
                <h4 className="mt-4 font-semibold text-lg">{item.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-emerald-600 font-bold">{item.price}</div>
                  <a href={`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(`Hi Svasth Ol, I want to order ${item.name}`)}`} className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm">Order</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS (intact) */}
      <section id="reviews" className="mt-20 py-16 bg-gradient-to-r from-emerald-50 via-amber-50 to-yellow-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-emerald-800">What Our Customers Say</h3>
          <p className="mt-2 text-gray-600">Real voices from our happy customers</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-white rounded-2xl p-5 shadow-md">
                <div className="flex justify-center gap-1 mb-2" aria-hidden>
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <Star key={j} size={16} className="text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700">“{r.text}”</p>
                <p className="mt-3 font-semibold text-emerald-700">— {r.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* src/svasthol_website_react.jsx — upgraded for mobile-first luxe animations
   Keeps desktop layout intact (md: and up classes unchanged), adds:
   - Floating decorative elements (mobile-only)
   - Menu: horizontal swipe carousel on mobile, grid on desktop
   - Reviews: swipeable carousel on mobile, grid on desktop
   - Glowing CTA / floating WhatsApp bubble
   - Auto-playing gentle animations (loops) for ambiance
*/

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Instagram, Youtube, Star, MessageCircle } from "lucide-react";
import { FloatingDecor, GlowButton } from "./src/components/MobileEffects";

// --- your data (unchanged)
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
  const [isMobile, setIsMobile] = useState(false);

  // carousel refs for drag constraints
  const menuRef = useRef(null);
  const reviewsRef = useRef(null);

  useEffect(() => {
    // mobile detection
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);

    // mouse-driven ambient offset (small)
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 18;
      setOffset({ x, y });
    };
    window.addEventListener("mousemove", handleMove);

    // scroll
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const filtered = cat === "All" ? MENU : MENU.filter((m) => m.category === cat);

  // quick helper to open WhatsApp with order text
  const openWhatsApp = (message) => {
    const phone = "91XXXXXXXXXX"; // replace with real number
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  };

  // looped ambient animation variants (auto-play)
  const ambientVariants = {
    floatA: { y: [0, -10, 0], x: [0, 6, 0] },
    floatB: { y: [0, -8, 0], x: [0, -6, 0] },
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gradient-to-b from-amber-50 via-emerald-50 to-yellow-50">

      {/* Mobile-only floating graphics */}
      <div className="md:hidden">
        <FloatingDecor />
      </div>

      {/* header */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? "bg-white/85 backdrop-blur-xl py-2 shadow-md" : "bg-white/70 py-4 backdrop-blur-sm"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3">
            <motion.img src="/svasthol_logo.png" alt="Svasth Ol" className={`h-10 w-auto transition-transform ${scrolled ? "scale-90" : "scale-100"}`} animate={{ rotate: 0 }} />
            <span className={`font-semibold ${scrolled ? "text-emerald-800" : "text-emerald-700"}`}>Svasth Ol</span>
          </a>
          <nav className="hidden md:flex gap-6">
            <a href="#menu" className="hover:text-emerald-600">Menu</a>
            <a href="#about" className="hover:text-emerald-600">About</a>
            <a href="#contact" className="hover:text-emerald-600">Contact</a>
          </nav>

          {/* mobile CTA */}
          <div className="md:hidden">
            <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })} className="bg-emerald-600 text-white px-4 py-2 rounded-full shadow">Order</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="relative pt-20 flex flex-col items-center justify-center text-center min-h-screen overflow-hidden">
        {/* ambient background circles (desktop also, but subtle) */}
        <motion.div className="absolute -left-20 top-10 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" animate={ambientVariants.floatA} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute right-6 bottom-36 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" animate={ambientVariants.floatB} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1 }} />

        <motion.img src="/svasthol_logo.png" alt="Svasth Ol" className="w-56 sm:w-72 md:w-96 mb-6 drop-shadow-[0_0_25px_rgba(16,185,129,0.25)]" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 6, repeat: Infinity }} style={{ transform: `translate(${offset.x}px, ${offset.y * 0.2}px)` }} />

        <motion.h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-emerald-800 mb-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          Natural · Trusted · Quality
        </motion.h1>

        {/* mobile glass CTA */}
        <div className="mt-6 md:hidden">
          <div className="mx-4 bg-white/60 backdrop-blur rounded-3xl px-4 py-3 shadow-lg inline-flex gap-3 items-center">
            <GlowButton className="bg-emerald-600 text-white" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>
              Explore Menu
            </GlowButton>
            <GlowButton className="bg-white text-emerald-700" onClick={() => window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent("Hi Svasth Ol, I would like to place an order")}`, "_blank")}>
              Order Now
            </GlowButton>
          </div>
        </div>

        {/* desktop CTAs (kept same) */}
        <div className="hidden md:flex gap-4 mt-10">
          <a href="#menu" className="px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold shadow-lg hover:bg-emerald-700 transition">Explore Menu</a>
          <a href="#contact" className="px-6 py-3 rounded-full border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 transition">Order Now</a>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="mt-6 md:mt-20 px-4 md:px-0">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-emerald-800 ml-1">Our Menu</h3>
          <p className="text-sm text-gray-600 ml-1">Healthy choices — made fresh daily.</p>

          {/* categories */}
          <div className="mt-4 flex gap-3 overflow-x-auto pb-3 md:gap-4 md:flex-wrap" style={{ WebkitOverflowScrolling: "touch" }}>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm ${cat === c ? "bg-emerald-600 text-white" : "bg-white border"}`}>
                {c}
              </button>
            ))}
          </div>

          {/* mobile: horizontal swipe carousel; desktop: grid */}
          <div className="mt-6">
            {/* Mobile carousel (drag-enabled) */}
            <div className="md:hidden">
              <motion.div ref={menuRef} className="flex gap-4 px-2 overflow-x-auto touch-pan-x pb-6" drag="x" dragConstraints={{ left: -1000, right: 0 }}
                whileTap={{ cursor: "grabbing" }}>
                {filtered.map((item) => (
                  <motion.div key={item.id} className="min-w-[76%] bg-white rounded-2xl p-4 shadow-lg" whileHover={{ scale: 1.02 }}>
                    <div className="h-36 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-100 to-amber-50 flex items-center justify-center text-2xl font-semibold text-amber-700">{item.name.split(" ")[0]}</div>
                    <h4 className="mt-3 font-semibold text-lg">{item.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-emerald-600 font-bold">{item.price}</div>
                      <button onClick={() => openWhatsApp(`Hi Svasth Ol 🌿%0AI'd like to order: ${item.name} x1`)} className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm">Order</button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Desktop grid (unchanged) */}
            <div className="hidden md:grid md:grid-cols-3 gap-6 mt-4">
              {filtered.map((item) => (
                <motion.div key={item.id} whileHover={{ translateY: -6 }} className="bg-white rounded-2xl p-5 shadow">
                  <div className="h-40 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-100 to-amber-50 flex items-center justify-center text-2xl font-semibold text-amber-700">{item.name.split(" ")[0]}</div>
                  <h4 className="mt-4 font-semibold text-lg">{item.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-emerald-600 font-bold">{item.price}</div>
                    <a href={`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(`Hi Svasth Ol, I want to order ${item.name}`)}`} className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm">Order on WhatsApp</a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mt-10 md:mt-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-800">About Svasth Ol</h3>
            <p className="mt-3 text-gray-700">Svasth Ol is a healthy cloud kitchen rooted in traditional flavours. We combine cold-pressed technology with time-tested recipes to deliver nutritious, delicious meals and drinks. Our mission is to make wholesome eating convenient and affordable.</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop" alt="about-hero" className="w-full h-56 md:h-80 object-cover" />
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="mt-10 md:mt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-emerald-800">What Our Customers Say</h3>
          <p className="text-sm text-gray-600">Real voices from our happy customers</p>

          {/* mobile swipe carousel */}
          <div className="mt-6 md:hidden">
            <motion.div ref={reviewsRef} className="flex gap-4 px-2 overflow-x-auto touch-pan-x pb-6" drag="x" dragConstraints={{ left: -1000, right: 0 }}>
              {REVIEWS.map((r, i) => (
                <motion.div key={i} className="min-w-[80%] bg-white rounded-2xl p-5 shadow-md" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i }}>
                  <div className="flex justify-center gap-1 mb-2" aria-hidden>
                    {Array.from({ length: r.stars }).map((_, j) => <Star key={j} size={16} className="text-amber-400" />)}
                  </div>
                  <p className="text-sm text-gray-700">“{r.text}”</p>
                  <p className="mt-3 font-semibold text-emerald-700">— {r.name}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* desktop grid */}
          <div className="hidden md:grid md:grid-cols-4 gap-6 mt-6">
            {REVIEWS.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-white rounded-2xl p-5 shadow-md">
                <div className="flex justify-center gap-1 mb-2" aria-hidden>
                  {Array.from({ length: r.stars }).map((_, j) => <Star key={j} size={16} className="text-amber-400" />)}
                </div>
                <p className="text-sm text-gray-700">“{r.text}”</p>
                <p className="mt-3 font-semibold text-emerald-700">— {r.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mt-10 md:mt-20 px-4 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-emerald-600 text-white p-6 rounded-2xl">
            <h3 className="text-2xl font-bold">Contact & Order</h3>
            <p className="mt-3 text-emerald-100">Place orders directly via WhatsApp or find us on delivery platforms.</p>
            <div className="mt-4 flex gap-3">
              <a href={`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent("Hi Svasth Ol, I would like to place an order")}`} className="flex-1 px-4 py-3 rounded-lg bg-white text-emerald-700 font-semibold text-center">Order on WhatsApp</a>
              <a href="https://www.swiggy.com" target="_blank" rel="noreferrer" className="px-4 py-3 rounded-lg border border-white text-white">Swiggy</a>
              <a href="https://www.zomato.com" target="_blank" rel="noreferrer" className="px-4 py-3 rounded-lg border border-white text-white">Zomato</a>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <form className="space-y-3">
              <input className="w-full rounded-md p-3 border" placeholder="Your name" />
              <input className="w-full rounded-md p-3 border" placeholder="Phone (10 digits)" />
              <textarea className="w-full rounded-md p-3 border" placeholder="Your order details (items, quantity, address)" rows={4} />
              <div className="flex gap-3">
                <button type="button" className="flex-1 px-4 py-3 rounded-lg bg-amber-400 text-emerald-900 font-semibold">Send Order</button>
                <button type="button" className="flex-1 px-4 py-3 rounded-lg border">Call</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* floating WhatsApp bubble (mobile-first) */}
      <div className="fixed bottom-6 right-5 z-50 md:right-8">
        <motion.button onClick={() => window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent("Hi Svasth Ol, I want to place an order")}`, "_blank")} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="bg-emerald-600 p-4 rounded-full shadow-lg text-white">
          <MessageCircle size={20} />
        </motion.button>
      </div>

      {/* ultra premium footer (kept as before) */}
      <footer className="relative mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-amber-50 to-yellow-50 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <img src="/svasthol_logo.png" alt="Svasth Ol" className="h-12 mb-2" />
            <h3 className="text-xl font-bold text-emerald-800">Svasth Ol</h3>
            <p className="text-sm text-gray-600">Authentic South-Indian wellness.</p>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-700 mb-2">Explore</h4>
            <ul className="space-y-1 text-gray-700">
              <li><a href="#home" className="hover:text-emerald-600">Home</a></li>
              <li><a href="#menu" className="hover:text-emerald-600">Menu</a></li>
              <li><a href="/terms" className="hover:text-emerald-600">Terms</a></li>
              <li><a href="/privacy-policy" className="hover:text-emerald-600">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-700 mb-2">Connect</h4>
            <p className="text-sm text-gray-700">📞 +91-XXXXXXXXXX</p>
            <p className="text-sm text-gray-700">✉️ hello@svasthol.example</p>
            <div className="flex gap-3 mt-2">
              <a href="#" className="hover:text-pink-500"><Instagram size={18} /></a>
              <a href="#" className="hover:text-red-500"><Youtube size={18} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-700 mb-2">Subscribe</h4>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="flex-1 rounded-l-md border p-2" />
              <button className="rounded-r-md bg-emerald-600 text-white px-4">Join</button>
            </div>
          </div>
        </div>

        <div className="text-center py-4 text-sm text-gray-600">© {new Date().getFullYear()} Svasth Ol — Crafted with 🌿 and Tradition</div>
      </footer>
    </div>
  );
}

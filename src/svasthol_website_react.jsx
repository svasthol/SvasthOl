import React, { useState, useEffect, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Instagram, Youtube, Star } from "lucide-react";

// ✅ Lazy-load MobileLuxury (mobile-only)
const MobileLuxury = React.lazy(() => import("./src/components/MobileLuxury"));

// =============================
// 🌿 Core Data
// =============================
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
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isOpeningCart, setIsOpeningCart] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);

  // 🌿 Smooth scroll
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  // 🌿 Mouse parallax (desktop only)
  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setOffset({ x, y });
    };
    if (window.innerWidth > 768) {
      window.addEventListener("mousemove", handleMove);
      return () => window.removeEventListener("mousemove", handleMove);
    }
  }, []);

  // 🌿 Scroll-based header shrink
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🌿 Low-end device optimization
  useEffect(() => {
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    if (isLowEnd) document.body.classList.add("reduced-motion");
  }, []);

  const filtered = cat === "All" ? MENU : MENU.filter((m) => m.category === cat);

  // =============================
  // 🌿 MAIN RENDER
  // =============================
  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gradient-to-b from-amber-50 via-emerald-50 to-yellow-50 animate-gradient">
      {/* ✅ MobileLuxury loads only on mobile */}
      <Suspense fallback={<div />}>
        {typeof window !== "undefined" && window.innerWidth < 768 && <MobileLuxury />}
      </Suspense>

      {/* Floating decor (very lightweight) */}
      <motion.img
        src="/graphics/leaf.svg"
        loading="lazy"
        alt=""
        className="fixed bottom-10 left-10 w-12 opacity-30 pointer-events-none"
        animate={{ y: [0, -10, 0], rotate: [10, 20, 10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src="/graphics/coconut.svg"
        loading="lazy"
        alt=""
        className="fixed top-20 right-16 w-16 opacity-30 pointer-events-none"
        animate={{ y: [0, 15, 0], rotate: [-10, 10, -10] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 🌿 Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
          scrolled ? "bg-white/80 backdrop-blur-xl shadow-lg py-2" : "bg-white/60 backdrop-blur-md shadow-sm py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          <a href="#home" className="flex items-center gap-2 group">
            <motion.div
              className={`w-11 h-11 rounded-full border flex items-center justify-center overflow-hidden transition-all ${
                scrolled ? "bg-white border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.5)]" : "bg-white border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              }`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <img
                src="/svasthol_logo.webp"
                loading="eager"
                alt="Svasth Ol Logo"
                className={`transition-all ${scrolled ? "w-7 h-7" : "w-8 h-8"}`}
              />
            </motion.div>
            <span className={`font-semibold ${scrolled ? "text-emerald-800 text-base" : "text-emerald-700 text-lg"}`}>
              Svasth Òl
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 font-medium text-emerald-800">
            <a href="#home" className="hover:text-emerald-600 transition">Home</a>
            <a href="#about" className="hover:text-emerald-600 transition">About</a>
            <a href="#menu" className="hover:text-emerald-600 transition">Menu</a>
            <a href="#contact" className="hover:text-emerald-600 transition">Contact</a>
          </nav>

          <a
            href="#order"
            className="hidden md:inline-block px-5 py-2 rounded-full bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700"
          >
            Order Now
          </a>
        </div>
      </header>

      {/* 🌿 Hero Section */}
      <section id="home" className="relative flex flex-col items-center justify-center min-h-screen text-center bg-white overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0 bg-gradient-to-r from-amber-50 via-emerald-50 to-yellow-50"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          style={{ backgroundSize: "200% 200%" }}
        />
        <div className="relative z-10 px-4">
          <motion.img
            src="/svasthol_logo.webp"
            loading="eager"
            alt="Svasth Ol Logo"
            style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="w-56 sm:w-80 h-auto mb-8 drop-shadow-lg hover:scale-105 transition-transform duration-700"
          />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-3xl sm:text-4xl font-semibold text-emerald-800"
          >
            Natural · Trusted · Quality
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="#menu" className="px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold shadow-lg hover:bg-emerald-700 transition">
              Explore Menu
            </a>
            <a href="#contact" className="px-6 py-3 rounded-full border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 transition">
              Order Now
            </a>
          </motion.div>
        </div>
      </section>

      {/* 🌿 MENU SECTION */}
      <section id="menu" className="relative z-10 mt-20 px-6 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-emerald-800">Our Menu</h3>
        <p className="mt-2 text-gray-600">Healthy choices — made fresh daily.</p>
        <div className="mt-6 flex gap-3 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm ${
                cat === c
                  ? "bg-emerald-600 text-white"
                  : "bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* 🖥️ Desktop Golden Grid (Untouched) */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map((item) => (
            <motion.div key={item.id} whileHover={{ translateY: -6 }} className="bg-white rounded-2xl p-5 shadow">
              <div className="h-40 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-100 to-amber-50 flex items-center justify-center text-2xl font-semibold text-amber-700">
                {item.name.split(" ")[0]}
              </div>
              <h4 className="mt-4 font-semibold text-lg">{item.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-emerald-600 font-bold">{item.price}</div>
                <a
                  href={`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(`Hi Svasth Ol, I want to order ${item.name}`)}`}
                  className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition"
                >
                  Order on WhatsApp
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

  
      {/* about */}
      <section id="about" className="mt-20 bg-gradient-to-r from-amber-50 via-emerald-50 to-yellow-50 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-bold text-emerald-800">About Svasth Ol</h3>
            <p className="mt-4 text-gray-700">Svasth Ol is a healthy cloud kitchen rooted in traditional flavours. We combine cold-pressed technology with time-tested recipes to deliver nutritious, delicious meals and drinks. Our mission is to make wholesome eating convenient and affordable.</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Cold-pressed juices with no preservatives</li>
              <li>• Pulihora & Podi rice made with authentic spices</li>
              <li>• Sustainable packaging & local sourcing</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="https://www.instagram.com/svasth_ol/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-pink-500">
                <Instagram size={18} />
                <span>Instagram</span>
              </a>
              <a href="https://www.youtube.com/channel/UCUkPG2jyOxipC0EDYCXZdFQ" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-red-600">
                <Youtube size={18} />
                <span>YouTube</span>
              </a>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop" alt="about-hero" className="w-full h-80 object-cover" />
          </div>
        </div>
      </section>

      {/* gallery */}
      <section id="gallery" className="mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-emerald-800">Gallery</h3>
          <p className="mt-2 text-gray-600">A glimpse into our kitchen and colorful creations.</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-sm">
                <img src={`https://picsum.photos/600/400?random=${i + 10}`} alt={`gallery-${i}`} className="w-full h-40 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* reviews */}
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

      {/* contact */}
      <section id="contact" className="mt-20 bg-emerald-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-3xl font-bold">Contact & Order</h3>
            <p className="mt-2 text-emerald-100">Place orders directly via WhatsApp or find us on delivery platforms.</p>
            <div className="mt-6 space-y-3">
              <p className="text-sm">📍 Kitchen: Hometown Rd, City — Open: 9 AM - 9 PM</p>
              <p className="text-sm">📞 Phone: +91-XXXXXXXXXX</p>
              <p className="text-sm">✉️ Email: hello@svasthol.example</p>
              <div className="flex gap-3 mt-4">
                <a href={`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent('Hi Svasth Ol, I would like to place an order')}`} className="px-4 py-3 rounded-lg bg-white text-emerald-700 font-semibold">Order on WhatsApp</a>
                <a href="https://www.swiggy.com" target="_blank" rel="noreferrer" className="px-4 py-3 rounded-lg border border-white text-white">Swiggy</a>
                <a href="https://www.zomato.com" target="_blank" rel="noreferrer" className="px-4 py-3 rounded-lg border border-white text-white">Zomato</a>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4">
            <form className="space-y-3">
              <input className="w-full rounded-md p-3 bg-white/20 placeholder-emerald-100" placeholder="Your name" />
              <input className="w-full rounded-md p-3 bg-white/20 placeholder-emerald-100" placeholder="Phone (10 digits)" />
              <textarea className="w-full rounded-md p-3 bg-white/20 placeholder-emerald-100" placeholder="Your order details (items, quantity, address)" rows={4} />
              <div className="flex gap-3">
                <button type="button" className="flex-1 px-4 py-3 rounded-lg bg-amber-400 text-emerald-900 font-semibold">Send Order</button>
                <button type="button" className="flex-1 px-4 py-3 rounded-lg border border-white">Call</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 🌿 Ultra Premium Footer */}
<footer className="relative mt-32 overflow-hidden">
  {/* Background gradient & decorative orbs */}
  <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-amber-50 to-yellow-50"></div>
  <motion.div
    className="absolute -top-10 -left-20 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl"
    animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
  />
  <motion.div
    className="absolute bottom-0 right-0 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl"
    animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
  />

  {/* Content */}
  <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
    
    {/* Brand Section */}
    <div>
      <img src="/svasthol_logo.png" alt="Svasth Ol Logo"
        className="h-14 w-auto mb-3 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
      <h3 className="text-2xl font-bold text-emerald-800">Svasth Ol</h3>
      <p className="text-amber-700 text-sm mt-1">Natural · Trusted · Quality</p>
      <p className="text-gray-600 text-sm mt-3">Authentic South-Indian wellness, re-imagined for the modern world.</p>
    </div>

    {/* Quick Links */}
    <div>
      <h4 className="font-semibold text-emerald-700 mb-3">Explore</h4>
      <ul className="space-y-2 text-gray-700">
        <li><a href="#home" className="hover:text-emerald-600">Home</a></li>
        <li><a href="#menu" className="hover:text-emerald-600">Menu</a></li>
        <li><a href="#about" className="hover:text-emerald-600">About</a></li>
        <li><a href="#contact" className="hover:text-emerald-600">Order Now</a></li>
        <li><a href="/terms" className="hover:text-emerald-600">Terms & Conditions</a></li>
        <li><a href="/privacy-policy" className="hover:text-emerald-600">Privacy Policy</a></li>
      </ul>
    </div>

    {/* Contact */}
    <div>
      <h4 className="font-semibold text-emerald-700 mb-3">Connect</h4>
      <p className="text-gray-700 text-sm">📍 Hometown Rd, City</p>
      <p className="text-gray-700 text-sm">📞 +91-XXXXXXXXXX</p>
      <p className="text-gray-700 text-sm">✉️ hello@svasthol.example</p>
      <div className="flex gap-4 mt-4">
        <a href="https://www.instagram.com/svasth_ol/" target="_blank" rel="noreferrer"
           className="hover:text-pink-500"><Instagram size={20}/></a>
        <a href="https://www.youtube.com/channel/UCUkPG2jyOxipC0EDYCXZdFQ" target="_blank" rel="noreferrer"
           className="hover:text-red-600"><Youtube size={20}/></a>
      </div>
    </div>

    {/* Newsletter */}
    <div>
      <h4 className="font-semibold text-emerald-700 mb-3">Stay Updated</h4>
      <p className="text-gray-600 text-sm mb-2">Join our list for fresh offers & new blends.</p>
      <div className="flex">
        <input type="email" placeholder="Your Email"
          className="flex-1 rounded-l-md border border-emerald-300 p-2 focus:outline-none" />
        <button className="bg-emerald-600 text-white px-4 rounded-r-md hover:bg-emerald-700">Join</button>
      </div>
    </div>
  </div>

  {/* Bottom Line */}
  <div className="relative z-10 border-t border-emerald-200 text-center py-4 text-sm text-gray-600">
    © {new Date().getFullYear()} <strong>Svasth Ol</strong> — Crafted with 🌿 and Tradition · All Rights Reserved
    </div>
  </footer>
</div>
  )
}

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Instagram, Youtube, Star } from 'lucide-react'

// Svasth Ol — React single-file component
// Fixed JSX syntax (all tags properly closed) and added smooth scroll + animated gradient + reviews

const MENU = [
  { id: 1, category: 'Cold Pressed Juices', name: 'Green Detox', desc: 'Spinach, apple, lemon, ginger — cold-pressed.', price: '₹149' },
  { id: 2, category: 'Cold Pressed Juices', name: 'Citrus Boost', desc: 'Orange, carrot, lemon — vitamin C rich.', price: '₹129' },
  { id: 3, category: 'Fruit Juices', name: 'Mango Fresh', desc: 'Seasonal ripe mango blended with love.', price: '₹119' },
  { id: 4, category: 'Pulihora & Rice', name: 'Classic Pulihora', desc: 'Tangy pulihora made with traditional tempering.', price: '₹99' },
  { id: 5, category: 'Pulihora & Rice', name: 'Podi Rice Box', desc: 'Flavourful podi rice with ghee & roasted nuts.', price: '₹89' },
]

const REVIEWS = [
  { name: 'Ananya R.', stars: 5, text: 'The juices are unbelievably fresh! The Green Detox has become my daily favorite.' },
  { name: 'Ravi Kumar', stars: 4, text: 'Loved the Pulihora and Podi Rice combo — tastes like homemade with a healthy twist.' },
  { name: 'Sneha Patel', stars: 5, text: 'Perfect balance of taste and health. Their Mango Fresh is heavenly!' },
  { name: 'Suresh Varma', stars: 4, text: 'Beautifully packed and delivered on time. Highly recommend Svasth Ol!' },
]

const CATEGORIES = ['All', 'Cold Pressed Juices', 'Fruit Juices', 'Pulihora & Rice']

export default function SvasthOlWebsite() {
  const [cat, setCat] = useState('All')

  useEffect(() => {
    // enable smooth scrolling for anchor links
    document.documentElement.style.scrollBehavior = 'smooth'
  }, [])

  const filtered = cat === 'All' ? MENU : MENU.filter((m) => m.category === cat)

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gradient-to-b from-amber-50 via-emerald-50 to-yellow-50 animate-gradient">
      {/* animated gradient keyframes (site-wide subtle theme) */}
      <style>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background: linear-gradient(120deg, #dff7e6 0%, #fff6db 40%, #fff1e0 100%);
          background-size: 200% 200%;
          animation: gradientFlow 18s ease infinite;
        }
      `}</style>

      {/* header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">S O</div>
            <div>
              <h1 className="text-lg font-semibold">Svasth Ol</h1>
              <p className="text-xs text-gray-600">Pure Taste · Natural Goodness</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#home" className="hover:text-emerald-600">Home</a>
            <a href="#menu" className="hover:text-emerald-600">Our Menu</a>
            <a href="#about" className="hover:text-emerald-600">About Us</a>
            <a href="#gallery" className="hover:text-emerald-600">Gallery</a>
            <a href="#reviews" className="hover:text-emerald-600">Reviews</a>
            <a href="#contact" className="hover:text-emerald-600">Contact / Order</a>

            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/svasth_ol/" target="_blank" rel="noreferrer" aria-label="Svasth Ol Instagram" className="hover:text-pink-500">
                <Instagram size={18} />
              </a>
              <a href="https://www.youtube.com/channel/UCUkPG2jyOxipC0EDYCXZdFQ" target="_blank" rel="noreferrer" aria-label="Svasth Ol YouTube" className="hover:text-red-600">
                <Youtube size={18} />
              </a>
            </div>
          </nav>

          <div className="md:hidden">
            <a href="#contact" className="px-3 py-2 rounded-md bg-emerald-600 text-white font-semibold text-sm">Order</a>
          </div>
        </div>
      </header>

      {/* hero */}
      <section
  id="home"
  className="pt-32 pb-24 flex flex-col items-center justify-center text-center bg-gradient-to-r from-emerald-100 via-amber-50 to-yellow-100 animate-gradient"
>
  <motion.img
    src="/svasthol_logo.png"
    alt="Svasth Ol Logo"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.2, ease: 'easeOut' }}
    className="w-40 h-auto mb-6 drop-shadow-md hover:drop-shadow-xl transition-all duration-500"
  />
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 1 }}
    className="text-4xl md:text-5xl font-extrabold text-emerald-800"
  >
    Natural · Trusted · Quality
  </motion.h2>
</section>


      {/* menu */}
      <section id="menu" className="mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-emerald-800">Our Menu</h3>
          <p className="mt-2 text-gray-600">Healthy choices — made fresh daily.</p>

          <div className="mt-6 flex gap-3 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-sm ${cat === c ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <motion.div key={item.id} whileHover={{ translateY: -6 }} className="bg-white rounded-2xl p-5 shadow">
                <div className="h-40 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-100 to-amber-50 flex items-center justify-center text-2xl font-semibold text-amber-700">{item.name.split(' ')[0]}</div>
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

      {/* footer */}
      <footer className="mt-20 py-8 bg-white border-t">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-emerald-800">Svasth Ol</p>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Svasth Ol. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <a href="https://www.instagram.com/svasth_ol/" target="_blank" rel="noreferrer" className="hover:text-pink-500" aria-label="Instagram link">
              <Instagram size={18} />
            </a>
            <a href="https://www.youtube.com/channel/UCUkPG2jyOxipC0EDYCXZdFQ" target="_blank" rel="noreferrer" className="hover:text-red-600" aria-label="YouTube link">
              <Youtube size={18} />
            </a>
            <a href="#" className="text-gray-600 hover:text-emerald-700">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-emerald-700">Terms</a>
            <a href="#contact" className="text-gray-600 hover:text-emerald-700">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

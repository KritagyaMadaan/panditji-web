import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { Service, Pandit } from "../types.ts";
const fallbackPandits = [
  {
    id: 101,
    name: "Pt. Rajesh Kumar Sharma",
    photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzxZor6gcNjiqb9QVbmKt8ZY3Q1J7mZuXCFq-9WuVFrzTrMAMb1KFcBsg7VsIk5nCQ4zicUz6OgC4Fq327OpQHQ0qn0ffZTRC1kJNxOKa-YMhCMwgpnNKHK9IGAajG1mW4nT7kpXVQ7Z2suSBZCt2H6dtL6AI3cVcTE4DjXDonpFDPS2rzvjckcSqbVIFcsdnhwovGMyWRx5bcAfMrl9_RGmkesaknfX60sVeefXHfk4RX6QDpZPnhW19MdSFJbwUVxL8tahqbGYc",
    rating: 4.9,
    experience: 22,
    specialization: "Griha Pravesh Specialist",
    price: 5100,
  },
  {
    id: 102,
    name: "Acharya Vinod Tiwari",
    photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcTY9uHJerBsfYUiZ9zDZLJabt1ceXjNykv19DS34xeExUNjSDzr8zI6_fkUQIx740x5gaTrdeHR7d7-zLesQ4i99EVkbmazwSZGT0_ug_aCg8mnkSRz2OurHPxG-B51Ba4l-uWU4te2sVwbpo7BgodnHtUrz9iF7lgFhRq5jJvwqllQBU4jl9ZpFSR5ZLYZUy9KPKfCPkRBft0ZYO9nOQHvSmJgdQ7NLOx93omnwFlXJzgGbgCoMs9v6xqF9S8iqC3iW15Mz7fBw",
    rating: 4.8,
    experience: 18,
    specialization: "Satyanarayan Specialist",
    price: 3100,
  },
  {
    id: 103,
    name: "Pt. Shyam Narayan Mishra",
    photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbgitUie3uy1S01HzEo8VeK_j7QZUf0Gb6bHnS2zqjOiALOX_Fh_1b89wNjc2tuGi8H0PHn4ZfMEqMyv306wh0Lv25iDBs83r5ncIHNo_XF8G2yllX9J9g3jAM-IUf5Y6KpgwY2xlEHS2u7iGHr2s_BwPxi0c4BwKOrzaPRf7Q6qD0BSP0S-oNDXfP1vCPrU_4AeDApe4_WkkeVy2fp1TIz6O0hOsOxQvuZYcPKbt6wEbN2SOafCoiBKTOe4adHyLmL49yIKAptrM",
    rating: 4.9,
    experience: 25,
    specialization: "Marriage Puja Specialist",
    price: 4200,
  }
];

interface HomeProps {
  services: Service[];
  pandits: Pandit[];
  onBook: (service: Service) => void;
  onFindPandit: () => void;
}

export default function Home({ services, pandits, onBook, onFindPandit }: HomeProps) {
  const navigate = useNavigate();
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchRitual, setSearchRitual] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.append("location", searchLocation);
    if (searchRitual) params.append("ritual", searchRitual);
    if (searchDate) params.append("date", searchDate);

    navigate(`/find-pandit?${params.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];
  const dateRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-surface font-sans selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
      {/* ANNOUNCEMENT BAR */}
      {showAnnouncement && (
        <div className="bg-[#FFF3E0] py-3 px-4 flex justify-center items-center relative z-50">
          <p className="text-primary font-bold text-center text-xs sm:text-sm">
            🪔 Now serving Delhi, Noida, Ghaziabad, Meerut & Bangalore — Book your ceremony today
          </p>
          <button
            className="absolute right-4 text-primary hover:opacity-70 transition-opacity"
            onClick={() => setShowAnnouncement(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="bg-[#FFF8F0] pt-12 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-outline-variant sacred-shadow"
            >
              <span className="text-primary">✨</span>
              <span className="text-[10px] font-black text-on-surface-variant/60 tracking-wider uppercase">India's #1 Devotional Marketplace</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-decorative text-5xl md:text-7xl lg:text-[72px] leading-tight text-on-surface"
            >
              Book a Verified <span className="text-primary italic underline decoration-secondary/30 underline-offset-8">Pandit</span> In 3 Clicks.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-on-surface-variant max-w-lg leading-relaxed"
            >
              Authentic Vedic rituals performed by certified experts at your doorstep. Trusted by 50,000+ families across India.
            </motion.p>

            <div className="flex flex-wrap gap-6 text-on-surface font-bold text-sm">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> 100% Certified
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Vedic Parampara
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Fixed Prices
              </span>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-3 rounded-3xl sacred-shadow flex flex-col lg:flex-row items-stretch lg:items-center border border-outline-variant gap-2 relative z-50">
              <div className="flex-1 min-w-[160px] p-4 flex items-center gap-3 border-b lg:border-b-0 lg:border-r border-outline-variant hover:bg-surface-container-low transition-colors rounded-2xl lg:rounded-none lg:rounded-l-2xl">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <div className="flex-1 relative">
                  <div className="text-[10px] uppercase font-black text-outline/60 tracking-widest">Location</div>
                  <select
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 font-black text-base text-on-surface cursor-pointer"
                  >
                    <option value="" disabled selected>Select Location</option>
                    <option value="delhi">Delhi NCR</option>
                    <option value="noida">Noida</option>
                    <option value="ghaziabad">Ghaziabad</option>
                    <option value="meerut">Meerut</option>
                    <option value="bangalore">Bangalore</option>
                  </select>
                </div>
              </div>
              <div className="flex-[1.5] min-w-[200px] p-4 flex items-center gap-3 border-b lg:border-b-0 lg:border-r border-outline-variant hover:bg-surface-container-low transition-colors rounded-2xl lg:rounded-none">
                <span className="material-symbols-outlined text-primary">search</span>
                <div className="flex-1 relative">
                  <div className="text-[10px] uppercase font-black text-outline/60 tracking-widest">Puja Ritual</div>
                  <select
                    value={searchRitual}
                    onChange={(e) => setSearchRitual(e.target.value)}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 font-black text-base text-on-surface cursor-pointer"
                  >
                    <option value="" disabled selected>Select Ritual</option>
                    <option value="griha-pravesh">Griha Pravesh</option>
                    <option value="satyanarayan">Satyanarayan Katha</option>
                    <option value="marriage">Marriage Puja</option>
                    <option value="rudrabhishek">Rudrabhishek</option>
                  </select>
                </div>
              </div>
              <div
                onClick={() => { dateRef.current?.showPicker(); }}
                className="flex-1 min-w-[180px] p-4 flex items-center gap-3 hover:bg-surface-container-low transition-colors rounded-2xl cursor-pointer relative overflow-hidden"
              >
                <input
                  ref={dateRef}
                  type="date"
                  min={today}
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, pointerEvents: 'none' }}
                />
                <span className="material-symbols-outlined text-primary">calendar_today</span>
                <div className="flex-1">
                  <div className="text-[10px] uppercase font-black text-outline/60 tracking-widest">Date</div>
                  <div className="font-black text-base text-on-surface">
                    {searchDate ? new Date(searchDate + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : "Select Date"}
                  </div>
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="lg:w-auto bg-primary text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-primary-container transition-all active:scale-95 shadow-xl shadow-primary/20"
              >
                Search <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative flex justify-center items-center">
            {/* Background Decoration */}
            <div className="absolute w-[120%] h-[120%] opacity-40 animate-spin-slow mandala-pattern"></div>
            <div className="absolute w-80 h-80 bg-surface-container rounded-full blur-3xl opacity-60"></div>

            {/* Main Pandit Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative w-full max-w-md bg-white p-6 rounded-[32px] sacred-shadow border border-outline-variant z-10 hover:translate-y-[-4px] transition-transform"
            >
              <div className="flex gap-4">
                <div className="relative">
                  <img
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-secondary/20"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG2kegPf-MRufi8UzPyYPfiTA1kmwZJzcSoFuG4YWENp_B8YwvjeDwCVZlYQ8SEnIA-mBBcrF9ecus8IwigGuKyn1iRONhQKE_9FYr0mdJxuKoY2EN7B3k84q_pLz5ZKeTSqtqsP2D_51RoDLQxiEKb4ZI0dWI60E-ZsN_dPSb--5wDiVSFz9UbBMVeslcd3nXhJzPqD8b2tIv96zLTa1DqBIHGKG-CI-WfI3uYKCFKZ0bh0oZkagS3FDPNQ09Q4o96VB32WdAGhw"
                    alt="Pandit Profile"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-lg shadow-sm">
                    <span className="material-symbols-outlined text-green-600 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-on-surface">Pt. Rajesh Kumar Sharma</h3>
                    <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-md border border-secondary/20">
                      <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-bold text-xs">4.9</span>
                    </div>
                  </div>
                  <p className="text-on-surface-variant font-bold text-xs mt-1">Griha Pravesh Specialist</p>
                  <p className="text-outline text-[10px] uppercase font-black tracking-widest mt-1">(284 genuine reviews)</p>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-on-surface-variant font-bold text-xs bg-surface-container-low/50 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-outline text-lg">fact_check</span>
                  KYC & Aadhaar Verified
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-green-700">Available Today</span>
                  </div>
                  <div className="bg-primary/5 px-3 py-1 rounded-md text-primary font-black text-[10px] uppercase tracking-widest">
                    Next slot 4:30 PM
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Badges */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl sacred-shadow border border-secondary/20 z-20 hidden md:block">
              <div className="text-[8px] uppercase font-black text-secondary tracking-widest mb-1">TOP RATED</div>
              <div className="text-on-surface font-bold text-sm">Gold Certified</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 -mt-12 relative z-20">
        <div className="bg-white border border-outline-variant rounded-[2.5rem] py-12 px-6 flex flex-wrap justify-around items-center gap-12 sacred-shadow">
          <div className="text-center group">
            <div className="text-5xl font-black text-on-surface leading-none group-hover:text-primary transition-colors italic tracking-tighter">5000+</div>
            <div className="text-on-surface-variant/60 font-black uppercase tracking-widest text-[10px] mt-3">Verified Pandits</div>
          </div>
          <div className="text-center group">
            <div className="text-5xl font-black text-on-surface leading-none group-hover:text-primary transition-colors italic tracking-tighter">12k+</div>
            <div className="text-on-surface-variant/60 font-black uppercase tracking-widest text-[10px] mt-3">Pujas Completed</div>
          </div>
          <div className="text-primary text-6xl animate-pulse hidden md:block">🪔</div>
          <div className="text-center group">
            <div className="text-5xl font-black text-on-surface leading-none group-hover:text-primary transition-colors italic tracking-tighter">4.9/5</div>
            <div className="text-on-surface-variant/60 font-black uppercase tracking-widest text-[10px] mt-3">Average Rating</div>
          </div>
        </div>
      </section>

      {/* SACRED SERVICES SECTION */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-on-surface italic tracking-tight">Sacred Services</h2>
              <p className="text-on-surface-variant/60 font-bold text-sm max-w-md">Browse our comprehensive list of Vedic rituals performed by certified Acharyas with full purity and precision.</p>
            </div>
            <button
              onClick={onFindPandit}
              className="text-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:gap-4 transition-all group"
            >
              Explore All Rituals <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { id: 1, name: "Griha Pravesh", icon: "🏠", price: "5,100", time: "120" },
              { id: 2, name: "Satyanarayan Katha", icon: "📖", price: "3,100", time: "90" },
              { id: 3, name: "Rudrabhishek", icon: "🔱", price: "7,500", time: "150" },
              { id: 4, name: "Navgraha Puja", icon: "🪐", price: "4,200", time: "90" },
              { id: 5, name: "Lakshmi Puja", icon: "💰", price: "2,500", time: "60" },
              { id: 6, name: "Mundan", icon: "✂️", price: "3,800", time: "90" },
              { id: 7, name: "Naamkaran", icon: "👶", price: "2,800", time: "60" },
              { id: 8, name: "Shradh Puja", icon: "🪔", price: "4,500", time: "120" },
              { id: 9, name: "Havan Ritual", icon: "🔥", price: "6,000", time: "180" },
              { id: 10, name: "Marriage Puja", icon: "💍", price: "15,000", time: "240" }
            ].map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -8 }}
                onClick={onFindPandit}
                className="bg-white p-6 rounded-3xl sacred-shadow border border-outline-variant/30 hover:border-primary/30 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 bg-surface-container-low rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h4 className="font-black text-on-surface text-sm mb-4 leading-tight">{service.name}</h4>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 pt-4 border-t border-outline-variant/10">
                  <span className="text-primary">₹{service.price}</span>
                  <span className="flex items-center gap-1 font-bold"><span className="material-symbols-outlined text-xs">schedule</span> {service.time}m</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-on-surface py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-[0.03] scale-150"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl font-black italic tracking-tight">How It Works</h2>
            <p className="text-white/40 font-bold text-sm max-w-lg mx-auto">Experiencing the divine is now simple and organized. Follow these three steps to perform your sacred ritual.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-16 relative">
            {[
              {
                step: 1,
                title: "Choose Your Ritual",
                desc: "Select from 50+ Vedic ceremonies. Customize requirements like location, date, and preferred language."
              },
              {
                step: 2,
                title: "Pick a Verified Pandit",
                desc: "Browse profiles with ratings, expertise, and verified documents. Transparent pricing for peace of mind."
              },
              {
                step: 3,
                title: "Seamless Experience",
                desc: "The Pandit arrives at your doorstep on time. Arrives with full samagri kit included for a hassle-free puja."
              }
            ].map((item) => (
              <div key={item.step} className="space-y-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-black shadow-xl shadow-primary/20 ring-8 ring-white/5">
                  {item.step}
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/10 w-full h-full">
                  <h3 className="text-xl font-black mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-white/40 font-bold text-xs leading-loose">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE ANCIENT WISDOM */}
      <section className="py-24 bg-surface-container-low/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl font-black text-on-surface italic tracking-tight">Experience Ancient Wisdom</h2>
            <p className="text-on-surface-variant/60 font-bold text-sm">Our most recommended Acharyas and Pandits with decades of ritualistic experience.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {(() => {
              const displayPandits = pandits && pandits.length > 0
                ? pandits.map((p, idx) => {
                  const fallback = fallbackPandits[idx % fallbackPandits.length];
                  return {
                    id: p.id,
                    name: p.name,
                    photoUrl: p.photoUrl || fallback.photoUrl,
                    rating: p.rating ? parseFloat(String(p.rating)) : fallback.rating,
                    experience: p.experience || fallback.experience,
                    specialization: (p as any).specialization || fallback.specialization,
                    price: (p as any).price || fallback.price
                  };
                }).slice(0, 3)
                : fallbackPandits;

              return displayPandits.map((pandit) => (
                <motion.div
                  key={pandit.id}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-[32px] overflow-hidden sacred-shadow border border-outline-variant/30 group transition-all"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      src={pandit.photoUrl}
                      alt={pandit.name}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-saffron font-bold text-xs flex items-center gap-1 shadow-md">
                      <span className="material-symbols-outlined text-xs text-saffron" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {pandit.rating}
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="bg-saffron text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">SADHANA</span>
                      <span className="bg-on-surface text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">{pandit.experience} YRS EXP</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4 text-left">
                    <div>
                      <h3 className="text-xl font-bold text-on-surface">{pandit.name}</h3>
                      <p className="text-outline text-sm font-semibold mt-1">{pandit.specialization}</p>
                    </div>
                    <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
                      <span className="material-symbols-outlined text-sm">verified_user</span> KYC &amp; Aadhaar Verified
                    </div>
                    <div className="pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                      <span className="text-on-surface font-bold text-lg">₹{pandit.price?.toLocaleString()}</span>
                      <button
                        onClick={onFindPandit}
                        className="bg-saffron/10 text-saffron font-bold px-4 py-2 rounded-lg hover:bg-saffron hover:text-white transition-colors cursor-pointer"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ));
            })()}
          </div>
        </div>
      </section>

      <section className="bg-linear-to-r from-on-surface to-inverse-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid md:grid-cols-3 gap-16 text-center text-white">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto ring-4 ring-white/5">
              <span className="material-symbols-outlined text-3xl text-primary">verified_user</span>
            </div>
            <h3 className="text-lg font-black tracking-tight">Verified Identity</h3>
            <p className="text-white/40 font-bold text-xs leading-loose">Every Acharya undergoes strict 4-level KYC and Vedic qualification screening.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto ring-4 ring-white/5">
              <span className="material-symbols-outlined text-3xl text-primary">inventory_2</span>
            </div>
            <h3 className="text-lg font-black tracking-tight">Samagri Included</h3>
            <p className="text-white/40 font-bold text-xs leading-loose">We handle all ritual materials. High-quality, pure organic samagri is part of the package.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto ring-4 ring-white/5">
              <span className="material-symbols-outlined text-3xl text-primary">payments</span>
            </div>
            <h3 className="text-lg font-black tracking-tight">Transparent Pricing</h3>
            <p className="text-white/40 font-bold text-xs leading-loose">No hidden costs or extra charges on site. Fixed dakshina and service fees always.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  ChevronRight, 
  FileText, 
  User, 
  Heart, 
  Briefcase, 
  Zap,
  Compass,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { cn } from "../lib/utils.ts";
import { Link, useNavigate } from "react-router-dom";

const consultationTypes = [
  {
    id: "kundali",
    title: "Kundali Report",
    desc: "Comprehensive birth chart analysis with life predictions.",
    price: 499,
    icon: <FileText size={32} />,
    color: "bg-gold/10 text-gold"
  },
  {
    id: "matching",
    title: "Kundali Matching",
    desc: "Determine celestial compatibility for a harmonious marriage.",
    price: 699,
    icon: <Heart size={32} />,
    color: "bg-gold/10 text-gold"
  },
  {
    id: "muhurat",
    title: "Muhurat Consultation",
    desc: "Identify the most auspicious timing for your major events.",
    price: 399,
    icon: <Calendar size={32} />,
    color: "bg-gold/10 text-gold"
  },
  {
    id: "career",
    title: "Career Consultation",
    desc: "Navigate your professional path with planetary guidance.",
    price: 899,
    icon: <Briefcase size={32} />,
    color: "bg-gold/10 text-gold"
  }
];

const astrologers = [
  {
    id: 1,
    name: "Pt. Shyam Narayan",
    photo: "🧘‍♂️",
    rating: 4.98,
    exp: 25,
    specs: ["Kundali", "Vastu", "Palmistry"]
  },
  {
    id: 2,
    name: "Dr. Meenakshi Iyer",
    photo: "📔",
    rating: 4.85,
    exp: 15,
    specs: ["Numerology", "Kundali", "Face Reading"]
  },
  {
    id: 3,
    name: "Acharya Vinod Tiwari",
    photo: "📿",
    rating: 4.92,
    exp: 20,
    specs: ["Vastu", "Gemology", "Muhurat"]
  }
];

export default function Astrology() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    tob: "",
    pob: ""
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/kundali/preview");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-text-dark font-sans overflow-x-hidden">
      {/* Hero Section - Deep Navy & Gold */}
      <section className="relative bg-[#0A0A1F] pt-40 pb-60 overflow-hidden">
        {/* Constellation SVG Pattern (Simplified) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="constellations" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.2" fill="#D4AF37" />
                <circle cx="10" cy="5" r="0.1" fill="#D4AF37" />
                <circle cx="15" cy="15" r="0.15" fill="#D4AF37" />
                <circle cx="5" cy="12" r="0.1" fill="#D4AF37" />
                <line x1="2" y1="2" x2="10" y2="5" stroke="#D4AF37" strokeWidth="0.05" opacity="0.3" />
                <line x1="10" y1="5" x2="15" y2="15" stroke="#D4AF37" strokeWidth="0.05" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#constellations)" />
          </svg>
        </div>

        {/* Top Gradient Transition */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent opacity-10 pointer-events-none"></div>
        
        {/* Radial Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0,transparent_70%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 lg:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-gold font-black text-[10px] uppercase tracking-[0.3em] mb-12 shadow-2xl">
              <Sparkles size={14} className="animate-pulse" /> Ancient Wisdom for the Modern Soul
            </div>
            <h1 className="text-7xl lg:text-9xl font-black text-white mb-10 leading-[0.85] tracking-tighter">
              Unlock the <span className="text-gold italic">Secrets</span> <br /> of Your <span className="relative">
                Stars
                <svg className="absolute -bottom-4 left-0 w-full h-4 text-gold/30" viewBox="0 0 200 20" fill="none" preserveAspectRatio="none">
                  <path d="M0 15C50 5 150 5 200 15" stroke="currentColor" strokeWidth="8" />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-white/50 mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
              Navigate your destiny with precision. Connect with certified Vedic astrologers and gain profound clarity on your life's path.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <button className="w-full sm:w-auto px-16 py-6 bg-gold text-white rounded-3xl font-black text-xs uppercase tracking-[0.25em] shadow-[0_20px_50px_rgba(212,175,55,0.3)] hover:bg-white hover:text-black hover:translate-y-[-4px] transition-all duration-500">
                Get Kundali
              </button>
              <button className="w-full sm:w-auto px-16 py-6 bg-transparent border-2 border-gold text-gold rounded-3xl font-black text-xs uppercase tracking-[0.25em] hover:bg-gold/10 hover:translate-y-[-4px] transition-all duration-500">
                Talk to Astrologer
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Consultation Types Grid */}
      <section className="max-w-7xl mx-auto px-4 lg:px-12 -mt-32 relative z-20 pb-48">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {consultationTypes.map((type, idx) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -15 }}
              className="bg-white rounded-[4rem] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-gold/10 flex flex-col items-center text-center group transition-all duration-500"
            >
              <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all group-hover:bg-gold group-hover:text-white group-hover:rotate-12", type.color)}>
                {type.icon}
              </div>
              <h3 className="text-2xl font-black text-text-dark mb-4 tracking-tight">{type.title}</h3>
              <p className="text-sm text-text-dark/40 mb-10 leading-relaxed font-bold">
                {type.desc}
              </p>
              <div className="mt-auto w-full">
                <div className="text-3xl font-black text-text-dark mb-8 italic">₹{type.price}</div>
                <button className="w-full py-5 bg-[#0A0A1F] text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gold transition-all shadow-xl">
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Free Kundali Preview Form */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="mb-20">
            <h2 className="text-5xl font-black tracking-tighter mb-8 leading-tight italic">Free <span className="text-gold">Kundali</span> Preview</h2>
            <p className="text-xl text-text-dark/40 font-medium max-w-xl mx-auto">Enter your primary birth details to generate an instant planetary snapshot.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-[#0A0A1F] text-white rounded-[4rem] p-10 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden border border-white/5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-[5rem]"></div>
            
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left relative z-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Full Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Aditi Sharma"
                  className="w-full bg-white/5 border-b border-white/10 focus:border-gold rounded-xl py-5 px-6 font-bold text-white transition-all outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Date of Birth</label>
                <input 
                  required
                  type="date" 
                  className="w-full bg-white/5 border-b border-white/10 focus:border-gold rounded-xl py-5 px-6 font-bold text-white transition-all outline-none color-scheme-dark"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Time of Birth</label>
                <input 
                  required
                  type="time" 
                  className="w-full bg-white/5 border-b border-white/10 focus:border-gold rounded-xl py-5 px-6 font-bold text-white transition-all outline-none color-scheme-dark"
                  value={formData.tob}
                  onChange={(e) => setFormData({...formData, tob: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Place of Birth</label>
                <input 
                  required
                  type="text" 
                  placeholder="City, State"
                  className="w-full bg-white/5 border-b border-white/10 focus:border-gold rounded-xl py-5 px-6 font-bold text-white transition-all outline-none"
                  value={formData.pob}
                  onChange={(e) => setFormData({...formData, pob: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2 pt-6">
                <button type="submit" className="w-full py-7 bg-gold text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-3xl shadow-gold/20 hover:bg-white hover:text-black transition-all duration-500 flex items-center justify-center gap-4">
                  Generate Free Preview
                  <ArrowRight size={20} />
                </button>
                <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                  Secure & Anonymous • Verified Vedic Algorithm
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Featured Astrologers */}
      <section className="py-48 bg-[#FFFDF5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-32">
            <div className="max-w-2xl">
               <div className="text-xs font-black text-gold uppercase tracking-[0.3em] mb-4">Supreme Experts</div>
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 italic">Featured <span className="text-gold">Astrologers</span></h2>
              <p className="text-xl text-text-dark/40 font-medium leading-relaxed">Vetted masters of the celestial arts, ready to solve your life's deepest queries.</p>
            </div>
            <button className="px-12 py-5 bg-[#0A0A1F] text-white font-black text-xs uppercase tracking-widest rounded-3xl hover:bg-gold transition-all shadow-2xl">
              View All Astrologers
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {astrologers.map((astro) => (
              <motion.div 
                key={astro.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[4rem] p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-gold/10 text-center relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-[3rem] -mr-8 -mt-8"></div>
                
                <div className="w-28 h-28 bg-[#0A0A1F] rounded-full mx-auto mb-8 flex items-center justify-center text-5xl shadow-2xl border-4 border-gold/20 overflow-hidden">
                  {astro.photo}
                </div>

                <div className="flex items-center justify-center gap-1.5 text-gold mb-6 italic">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  <span className="text-sm font-black ml-2 text-text-dark">{astro.rating}</span>
                </div>

                <h4 className="text-3xl font-black text-text-dark mb-2 tracking-tight">{astro.name}</h4>
                <div className="text-gold text-[10px] font-black uppercase tracking-[0.3em] mb-8">{astro.exp}+ Years Experience</div>
                
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                  {astro.specs.map(s => (
                    <span key={s} className="px-4 py-1.5 bg-gold/5 text-gold text-[9px] font-black uppercase tracking-widest rounded-full border border-gold/10">
                      {s}
                    </span>
                  ))}
                </div>

                <button className="w-full py-5 bg-[#0A0A1F] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gold hover:shadow-2xl transition-all">
                  Consult Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Authenticity Trust Markers */}
      <section className="py-24 border-t border-gold/10 bg-[#0A0A1F] text-white/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <div className="flex flex-wrap justify-center items-center gap-16 lg:gap-32 font-black text-[10px] uppercase tracking-[0.4em]">
             <div className="flex items-center gap-4"><ShieldCheck className="text-gold" size={20} /> Verified Experts</div>
             <div className="flex items-center gap-4"><ShieldCheck className="text-gold" size={20} /> 100% Confidential</div>
             <div className="flex items-center gap-4"><ShieldCheck className="text-gold" size={20} /> Secure Payments</div>
             <div className="flex items-center gap-4"><ShieldCheck className="text-gold" size={20} /> Authentic Jyotish</div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-24 bg-white border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-[#0A0A1F] rounded-[1.5rem] flex items-center justify-center text-gold font-bold text-3xl mb-10 shadow-2xl">अ</div>
            <h2 className="text-2xl font-black tracking-tighter mb-4">BookPandit<span className="text-gold">Ji</span> Astrology</h2>
            <p className="text-text-dark/30 text-[10px] font-black uppercase tracking-[0.2em] mb-12">Universal Guidance, Sacred Precision.</p>
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-text-dark/30">
               <a href="#" className="hover:text-gold transition-colors text-center">Consultation Policy</a>
               <a href="#" className="hover:text-gold transition-colors text-center">Accuracy Disclosure</a>
               <a href="#" className="hover:text-gold transition-colors text-center">Support</a>
            </div>
        </div>
      </footer>
    </div>
  );
}

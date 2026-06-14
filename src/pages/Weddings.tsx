import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Users, 
  Gem, 
  Sparkles, 
  Check, 
  ArrowRight,
  Phone,
  FileText,
  Clock,
  Compass,
  ShieldCheck
} from "lucide-react";
import { cn } from "../lib/utils.ts";

const weddingServices = [
  {
    title: "Vedic Marriage Pandit",
    desc: "Experienced Sanskrit scholars specifically trained in marriage rites across all traditions (North, South, Bengali, etc).",
    icon: <Heart size={32} />,
    color: "bg-gold/10 text-gold"
  },
  {
    title: "Destination Sevas",
    desc: "Complete ritual management for weddings at sacred sites like Triyuginarayan, Kashi, or Vrindavan.",
    icon: <Compass size={32} />,
    color: "bg-gold/10 text-gold"
  },
  {
    title: "Elite Muhurat Prep",
    desc: "In-depth astrological analysis to find the perfect union window for the couple's long-term prosperity.",
    icon: <Clock size={32} />,
    color: "bg-gold/10 text-gold"
  },
  {
    title: "Premium Samagri",
    desc: "Hand-picked, pure Vedic samagri including rare herbs and high-quality items for an authentic atmosphere.",
    icon: <Gem size={32} />,
    color: "bg-gold/10 text-gold"
  }
];

const processSteps = [
  {
    title: "Consultation",
    desc: "Discuss your tradition and preferences with our expert wedding acharyas.",
    icon: <Users size={24} />
  },
  {
    title: "Muhurat Selection",
    desc: "Identify the absolute most auspicious date and time for your union.",
    icon: <Calendar size={24} />
  },
  {
    title: "Ritual Roadmap",
    desc: "A detailed timeline for Haldi, Mehendi, and the main wedding ceremony.",
    icon: <FileText size={24} />
  },
  {
    title: "Divine Execution",
    desc: "Experience a seamless, spiritual, and traditionally perfect wedding ritual.",
    icon: <Sparkles size={24} />
  }
];

const destinations = [
  {
    name: "Triyuginarayan Temple",
    location: "Uttarakhand",
    price: "₹1,25,000",
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2073&auto=format&fit=crop"
  },
  {
    name: "Banke Bihari Temple",
    location: "Vrindavan",
    price: "₹75,000",
    image: "https://images.unsplash.com/photo-1621217030800-47e13203494b?q=80&w=2069&auto=format&fit=crop"
  },
  {
    name: "Kashi Vishwanath",
    location: "Varanasi",
    price: "₹85,000",
    image: "https://images.unsplash.com/photo-1561047029-3000c6812c86?q=80&w=1974&auto=format&fit=crop"
  },
  {
    name: "ISKCON Temples",
    location: "All Major Cities",
    price: "₹65,000",
    image: "https://images.unsplash.com/photo-1602410321272-ef0865761f22?q=80&w=1964&auto=format&fit=crop"
  }
];

const packages = [
  {
    name: "Silver",
    price: "50,000",
    desc: "Essential rituals for a traditional wedding.",
    features: ["1 Expert Pandit", "Basic Puja Samagri", "2-hour Ceremony", "Standard Muhurat Consultation", "Online Support"],
    popular: false
  },
  {
    name: "Gold",
    price: "1,50,000",
    desc: "Comprehensive coverage for multiple ceremonies.",
    features: ["2 Senior Pandits", "Premium Puja Samagri", "Haldi, Mehendi & Wedding", "Decor Coordination", "Unlimited Consultation", "Samagri Liaison"],
    popular: true
  },
  {
    name: "Platinum",
    price: "5,00,000+",
    desc: "Ultimate luxury with full event management.",
    features: ["Multiple Choice Pandits", "Full Ritual Management", "All Pre-Wedding Rituals", "Photography Liaison", "Destination Support", "Personal Host", "VVIP Guest Support"],
    popular: false
  }
];

export default function Weddings() {
  const [formData, setFormData] = useState({
    names: "",
    date: "",
    guests: "",
    city: "",
    budget: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Inquiry submitted! Our wedding concierge will contact you within 2 hours.");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-text-dark font-sans overflow-x-hidden selection:bg-gold/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 lg:pt-48 lg:pb-64 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-30 grayscale pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-gold/10 to-transparent pointer-events-none"></div>
        
        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-saffron/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/50 backdrop-blur-md border border-gold/20 rounded-full text-gold font-black text-[10px] uppercase tracking-[0.25em] mb-10 shadow-sm">
                <Sparkles size={14} className="animate-pulse" /> The Gold Standard in Vedic Weddings
              </div>
              <h1 className="text-7xl lg:text-9xl font-black mb-10 leading-[0.85] tracking-tighter">
                Your Sacred <span className="text-gold italic">Union</span>, Perfectly <span className="relative">
                  Arranged
                  <svg className="absolute -bottom-4 left-0 w-full h-4 text-gold/30" viewBox="0 0 200 20" fill="none" preserveAspectRatio="none">
                    <path d="M0 15C50 5 150 5 200 15" stroke="currentColor" strokeWidth="8" />
                  </svg>
                </span>
              </h1>
              <p className="text-xl text-text-dark/60 font-medium mb-12 max-w-xl leading-relaxed">
                Experience end-to-end spiritual management for your wedding. From identifying the perfect muhurat to managing complex Vedic rituals at India's most sacred temples.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 items-center lg:items-start">
                <button className="w-full sm:w-auto px-16 py-6 bg-saffron text-white rounded-3xl font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-saffron/40 hover:bg-text-dark hover:translate-y-[-4px] transition-all duration-500">
                  Book Consultation
                </button>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gold border border-gold/10 shadow-xl">
                    <Phone size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/40">Expert Line</div>
                    <div className="text-lg font-black text-gold">+91 98711 00000</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative"
            >
              <div className="aspect-[4/5] lg:h-[700px] rounded-[5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(212,175,55,0.3)] border-[12px] border-white group relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?q=80&w=2070&auto=format&fit=crop" 
                  alt="Sacred Wedding Rituals" 
                  className="w-full h-full object-cover transition-transform duration-2000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gold/60 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-12 left-12 right-12">
                   <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] text-white">
                      <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">Legacy Excellence</div>
                      <h3 className="text-3xl font-black italic mb-4">"A union blessed by tradition is a union built for eternity."</h3>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gold/50 flex items-center justify-center font-black">OM</div>
                         <div className="text-sm font-bold">Acharya Varma</div>
                      </div>
                   </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2.5rem] shadow-2xl z-20 border border-gold/10 hidden xl:block animate-bounce-slow">
                 <div className="text-4xl font-black text-gold mb-1">5000+</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/40">Blessed Unions</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Markers */}
      <section className="py-20 border-y border-gold/10 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
           <div className="flex flex-wrap justify-center items-center gap-16 lg:gap-32 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center gap-4 text-2xl font-black tracking-tighter">VEDIC <span className="text-gold">COUNCIL</span></div>
              <div className="flex items-center gap-4 text-2xl font-black tracking-tighter">SPIRITUAL <span className="text-gold">LIVING</span></div>
              <div className="flex items-center gap-4 text-2xl font-black tracking-tighter">HERITAGE <span className="text-gold">WEDDINGS</span></div>
              <div className="flex items-center gap-4 text-2xl font-black tracking-tighter">DHARMA <span className="text-gold">PRIME</span></div>
           </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-40 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <div className="max-w-3xl mb-24">
            <h2 className="text-5xl font-black tracking-tight mb-8">The Wedding Journey</h2>
            <p className="text-xl text-text-dark/40 font-medium">We break down centuries of tradition into a seamless, manageable roadmap for the modern couple.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gold/10 -translate-y-1/2 hidden lg:block pointer-events-none"></div>
             
             {processSteps.map((step, idx) => (
               <motion.div
                 key={step.title}
                 initial={{ opacity: 0, filter: "blur(10px)" }}
                 whileInView={{ opacity: 1, filter: "blur(0px)" }}
                 transition={{ delay: idx * 0.2 }}
                 className="relative z-10 space-y-6"
               >
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gold shadow-xl border border-gold/10 mb-8 font-black">
                    {idx + 1}
                 </div>
                 <h3 className="text-2xl font-black tracking-tight">{step.title}</h3>
                 <p className="text-md font-medium text-text-dark/40 leading-relaxed">{step.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-40 bg-gold/5 relative">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <div className="text-center mb-32">
            <h2 className="text-5xl lg:text-6xl font-black tracking-tight mb-8">Sacred Expertise</h2>
            <p className="text-xl text-text-dark/40 font-medium max-w-2xl mx-auto">Providing authentic Vedic sevas for your spiritual wedding journey with unparalleled attention to detail.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {weddingServices.map((service, idx) => (
              <motion.div
                key={service.title}
                whileHover={{ y: -15 }}
                className="bg-white p-12 rounded-[4rem] border border-gold/10 shadow-2xl shadow-gold/5 flex flex-col items-center text-center group transition-all duration-500"
              >
                <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 transition-all group-hover:bg-gold group-hover:text-white group-hover:rotate-12", service.color)}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black mb-6 tracking-tight">{service.title}</h3>
                <p className="text-sm font-medium text-text-dark/40 leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-48 relative overflow-hidden bg-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-32">
            <div className="max-w-2xl">
               <div className="text-xs font-black text-gold uppercase tracking-[0.3em] mb-4">Exclusive Locations</div>
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 italic">Destination <span className="text-gold">Weddings</span></h2>
              <p className="text-xl text-text-dark/40 font-medium">Create lifelong memories at India's most powerful energetic vortexes and heritage temples.</p>
            </div>
            <button className="px-12 py-5 bg-text-dark text-white font-black text-xs uppercase tracking-widest rounded-3xl hover:bg-gold transition-all shadow-2xl">
              Download Destination Guide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {destinations.map((dest, idx) => (
              <motion.div 
                key={dest.name} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative rounded-[4rem] overflow-hidden shadow-2xl aspect-[3/4.5] cursor-pointer"
              >
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-text-dark/90 via-text-dark/20 to-transparent"></div>
                <div className="absolute bottom-12 left-12 right-12 text-white">
                  <div className="flex items-center gap-2 text-gold text-[10px] font-black uppercase tracking-widest mb-3">
                    <MapPin size={12} /> {dest.location}
                  </div>
                  <h4 className="text-3xl font-black mb-6 leading-tight">{dest.name}</h4>
                  <div className="flex items-center justify-between">
                     <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 group-hover:text-gold transition-colors">From {dest.price}</div>
                     <ArrowRight size={20} className="text-white transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Packages */}
      <section className="py-48 bg-[#1A1A1A] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 lg:px-12 relative z-10">
          <div className="text-center mb-32">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tight mb-8">Tailored Ritual <span className="text-gold">Packages</span></h2>
            <p className="text-xl text-white/40 font-medium max-w-xl mx-auto">Investment in a lifetime of spiritual harmony and traditional perfection.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            {packages.map((pkg) => (
              <motion.div 
                key={pkg.name} 
                whileHover={{ y: -10 }}
                className={cn(
                  "rounded-[4rem] p-16 relative flex flex-col transition-all duration-500",
                  pkg.popular 
                    ? "bg-gradient-to-b from-[#111] to-[#000] border-2 border-gold shadow-[0_50px_100px_-20px_rgba(212,175,55,0.2)] scale-110 z-20 py-20" 
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                )}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-white px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                    Gold Standard
                  </div>
                )}
                <div className="text-center mb-16">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-4">{pkg.name} Membership</div>
                  <div className="text-6xl font-black mb-6">₹{pkg.price}</div>
                  <p className="text-sm font-bold text-white/40">{pkg.desc}</p>
                </div>

                <div className="space-y-8 flex-grow">
                  {pkg.features.map(f => (
                    <div key={f} className="flex items-center gap-5 text-sm font-bold text-white/60">
                      <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0 border border-gold/20">
                        <Check size={16} />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>

                <button className={cn(
                  "w-full py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all mt-16",
                  pkg.popular 
                    ? "bg-gold text-white shadow-3xl shadow-gold/20 hover:bg-white hover:text-black" 
                    : "bg-white/10 text-white border border-white/20 hover:bg-gold hover:text-white"
                )}>
                  Select {pkg.name}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-48 bg-white" id="enquiry">
         <div className="max-w-7xl mx-auto px-4 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div className="space-y-12">
                  <h2 className="text-6xl font-black tracking-tighter leading-[0.9]">Plan Your <span className="text-gold italic">Ritual Roadmap</span></h2>
                  <p className="text-xl text-text-dark/40 font-medium leading-relaxed max-w-md">Our expert wedding acharyas are ready to help you navigate the complexity of Vedic traditions with modern ease.</p>
                  
                  <div className="space-y-8">
                     <div className="flex items-center gap-6 p-6 rounded-3xl bg-gold/5 border border-gold/10">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gold shadow-lg">
                           <Clock size={24} />
                        </div>
                        <div>
                           <div className="text-lg font-black">2-Hour Response</div>
                           <div className="text-xs font-bold text-text-dark/40 whitespace-nowrap">Fast turnarounds for urgent consultations.</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-6 p-6 rounded-3xl bg-gold/5 border border-gold/10">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gold shadow-lg">
                           <Phone size={24} />
                        </div>
                        <div>
                           <div className="text-lg font-black">Expert Support</div>
                           <div className="text-xs font-bold text-text-dark/40 whitespace-nowrap">Highly trained and background-checked acharyas.</div>
                        </div>
                     </div>
                  </div>
               </div>

               <motion.form 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit} 
                className="bg-[#111] text-white rounded-[4rem] p-12 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-[5rem]"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Couple's Full Names</label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-white/5 border-b border-white/20 focus:border-gold rounded-xl py-5 px-6 font-bold text-white transition-all outline-none"
                        placeholder="e.g. Rahul & Priya"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Ideal Wedding Date</label>
                      <input 
                        required
                        type="date" 
                        className="w-full bg-white/5 border-b border-white/20 focus:border-gold rounded-xl py-5 px-6 font-bold text-white transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Est. Guest Count</label>
                      <input 
                        type="number" 
                        className="w-full bg-white/5 border-b border-white/20 focus:border-gold rounded-xl py-5 px-6 font-bold text-white transition-all outline-none"
                        placeholder="e.g. 500"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Target City</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/5 border-b border-white/20 focus:border-gold rounded-xl py-5 px-6 font-bold text-white transition-all outline-none"
                        placeholder="Enter City"
                      />
                    </div>
                    <div className="space-y-4 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Wedding Budget Estimate</label>
                      <select className="w-full bg-white/5 border-b border-white/20 focus:border-gold rounded-xl py-5 px-6 font-bold text-white transition-all outline-none cursor-pointer appearance-none">
                        <option className="bg-[#111]">Select Range</option>
                        <option className="bg-[#111]">Under ₹1,00,000</option>
                        <option className="bg-[#111]">₹1,00,000 - ₹5,00,000</option>
                        <option className="bg-[#111]">₹5,00,000 - ₹10,00,000</option>
                        <option className="bg-[#111]">₹10,00,000+</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full mt-16 py-7 bg-gold text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-3xl shadow-gold/30 hover:bg-white hover:text-black transition-all duration-500 flex items-center justify-center gap-4">
                    Send Personalized Proposal
                    <ArrowRight size={20} />
                  </button>
               </motion.form>
            </div>
         </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-24 bg-white border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-gold rounded-[1.5rem] flex items-center justify-center text-white font-bold text-3xl mb-10 shadow-2xl">ॐ</div>
            <h2 className="text-2xl font-black tracking-tighter mb-4">BookPandit<span className="text-gold">Ji</span> Weddings</h2>
            <p className="text-text-dark/30 text-[10px] font-black uppercase tracking-[0.2em] mb-12">Sacred Traditions, Modern Union.</p>
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-text-dark/30">
               <a href="#" className="hover:text-gold transition-colors text-center">Privacy Policy</a>
               <a href="#" className="hover:text-gold transition-colors text-center">Terms of Service</a>
               <a href="#" className="hover:text-gold transition-colors text-center">Ritual Policy</a>
            </div>
        </div>
      </footer>
    </div>
  );
}

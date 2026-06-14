import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Calendar, 
  CheckCircle, 
  Star, 
  Clock, 
  MapPin, 
  Sparkles 
} from "lucide-react";
import { Service, Pandit } from "../types.ts";

interface HomeProps {
  services: Service[];
  pandits: Pandit[];
  onBook: (service: Service) => void;
  onFindPandit: () => void;
}

export default function Home({ services, pandits, onBook, onFindPandit }: HomeProps) {
  return (
    <>
      {/* Hero Section */}
      <main className="relative z-10 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center max-w-7xl mx-auto px-4 lg:px-12">
          <div className="lg:col-span-7 py-20 lg:py-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-saffron/10 text-saffron rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-saffron/10">
                <Sparkles size={14} className="mr-2" />
                India's #1 Devotional Marketplace
              </div>
              <h2 className="text-6xl md:text-8xl font-black mb-8 text-text-dark leading-[0.9] tracking-tighter">
                Book a Verified <span className="text-saffron italic">Pandit</span> In 3 Clicks.
              </h2>
              <p className="text-xl text-text-dark/60 mb-12 max-w-lg leading-relaxed font-medium">
                Authentic Vedic rituals performed by certified experts at your home. Simplified devotion for the modern devotee.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-saffron/10 border border-saffron/5 max-w-2xl relative z-20">
                <div className="relative flex-1 group">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-saffron" size={20} />
                  <select className="w-full bg-slate-50/50 border-none rounded-[1.8rem] py-4 pl-14 pr-6 font-bold text-text-dark focus:ring-0 appearance-none cursor-pointer">
                    <option>Delhi NCR</option>
                    <option>Mumbai</option>
                    <option>Bangalore</option>
                    <option>Hyderabad</option>
                    <option>Pune</option>
                    <option>Jaipur</option>
                  </select>
                </div>
                <div className="relative flex-[1.5] group border-l border-saffron/10 ml-2">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dark/30 group-focus-within:text-saffron transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search Puja rituals..."
                    className="w-full bg-white border-none rounded-[1.8rem] py-4 pl-14 pr-6 font-bold text-text-dark focus:ring-0 placeholder:text-text-dark/20"
                  />
                </div>
                <button 
                  onClick={onFindPandit}
                  className="bg-saffron text-white px-8 py-4 rounded-[1.8rem] font-black text-lg hover:bg-text-dark transition-all duration-500 shadow-lg shadow-saffron/40"
                >
                  Search
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-8 mt-12 opacity-60">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-500" />
                  <span className="text-xs font-black uppercase tracking-[0.1em]">100% Certified</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-500" />
                  <span className="text-xs font-black uppercase tracking-[0.1em]">Vedic Parampara</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-500" />
                  <span className="text-xs font-black uppercase tracking-[0.1em]">Fixed Prices</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative py-20 lg:py-0 flex justify-center h-full min-h-[500px]">
             {/* Animated Floating Card */}
             <motion.div
               animate={{ 
                 y: [0, -20, 0],
                 rotate: [0, 1, 0, -1, 0]
               }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="relative z-20 w-80 sm:w-96 self-center"
             >
                <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(255,107,0,0.15)] border border-saffron/10 p-10 overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-2xl group-hover:bg-saffron/10 transition-colors"></div>
                  <div className="w-24 h-24 bg-saffron/5 rounded-full mb-8 flex items-center justify-center border-2 border-saffron/10 overflow-hidden shadow-inner">
                     <span className="text-5xl">🧘‍♂️</span>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-24 bg-saffron/10 rounded-full"></div>
                    <div className="h-8 w-48 bg-text-dark/5 rounded-2xl"></div>
                    <div className="h-4 w-full bg-text-dark/5 rounded-full"></div>
                    <div className="h-4 w-2/3 bg-text-dark/5 rounded-full"></div>
                  </div>
                  <div className="mt-10 pt-8 border-t border-dashed border-saffron/20 flex justify-between items-center text-gold">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider">Top Rated</span>
                  </div>
                </div>
                {/* Secondary floating accent */}
                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-10 -left-10 bg-text-dark text-white p-6 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10"
                >
                  <Calendar className="text-saffron" size={24} />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Next Slot</div>
                    <div className="text-sm font-bold">Today, 4:30 PM</div>
                  </div>
                </motion.div>
             </motion.div>

             {/* Background Mandala Fragment */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] opacity-[0.05] select-none pointer-events-none rotate-12">
                <svg viewBox="0 0 200 200" className="w-full h-full text-saffron fill-current">
                   <path d="M100 0 A100 100 0 0 1 100 200 A100 100 0 0 1 100 0 M100 20 L120 80 L180 100 L120 120 L100 180 L80 120 L20 100 L80 80 Z" />
                </svg>
             </div>
          </div>
        </div>
      </main>

      {/* Service Category Grid */}
      <section className="bg-white py-32 border-y border-saffron/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <div className="text-center mb-20">
            <h3 className="text-5xl font-black text-text-dark mb-6">Sacred Services</h3>
            <p className="text-text-dark/40 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Find spiritual peace through our curated selection of verified Vedic ceremonies.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[
              { name: "Griha Pravesh", icon: "🏠", color: "bg-blue-50" },
              { name: "Satyanarayan", icon: "📖", color: "bg-orange-50" },
              { name: "Rudrabhishek", icon: "🔱", color: "bg-red-50" },
              { name: "Navgraha Puja", icon: "🪐", color: "bg-indigo-50" },
              { name: "Lakshmi Puja", icon: "💰", color: "bg-yellow-50" },
              { name: "Mundan", icon: "✂️", color: "bg-slate-50" },
              { name: "Naamkaran", icon: "👶", color: "bg-pink-50" },
              { name: "Shradh", icon: "🕯️", color: "bg-gray-50" },
              { name: "Havan", icon: "🔥", color: "bg-amber-50" },
              { name: "Marriage Puja", icon: "💍", color: "bg-rose-50" }
            ].map((cat) => (
              <motion.div
                key={cat.name}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
                onClick={onFindPandit}
              >
                <div className={`${cat.color} p-10 rounded-[2.5rem] mb-6 flex items-center justify-center text-4xl shadow-sm border border-transparent group-hover:border-saffron/20 transition-all duration-500`}>
                  {cat.icon}
                </div>
                <h4 className="text-center text-xs font-black uppercase tracking-widest text-text-dark/60 group-hover:text-saffron transition-colors">
                  {cat.name}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Timeline */}
      <section className="py-32 bg-text-dark relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-8">
            <div>
              <h3 className="text-5xl font-black text-white mb-6">How it Works</h3>
              <p className="text-white/40 text-xl font-medium max-w-xl">Connecting you with divine wisdom in just three steps.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            <div className="absolute top-12 left-0 w-full h-px bg-white/5 hidden md:block"></div>
            {[
              { step: "01", title: "Select Service", desc: "Browse 50+ Vedic ceremonies tailored to your needs." },
              { step: "02", title: "Pick Your Pandit", desc: "Choose from certified, verified local experts." },
              { step: "03", title: "Ritual Performed", desc: "Your Pandit arrives with all necessary samagri." }
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="w-20 h-20 bg-saffron text-white rounded-[2rem] flex items-center justify-center text-2xl font-black mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-saffron/40">
                  {item.step}
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">{item.title}</h4>
                <p className="text-white/40 text-lg leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-4xl font-black text-text-dark mb-2">5000+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/40">Verified Pandits</div>
            </div>
            <div>
              <div className="text-4xl font-black text-text-dark mb-2">12k+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/40">Pujas Completed</div>
            </div>
            <div>
              <div className="text-4xl font-black text-text-dark mb-2">4.9/5</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/40">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-black text-text-dark mb-2">50+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/40">Sacred Services</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="max-w-7xl mx-auto px-4 py-24 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h3 className="text-4xl font-bold text-text-dark mb-3">Sacred Services</h3>
            <p className="text-text-dark/50 text-lg">Curated ceremonies for every sacred milestone</p>
          </div>
          <button 
            onClick={onFindPandit}
            className="bg-gold/10 text-gold px-6 py-2 rounded-full font-bold text-sm border border-gold/10 hover:bg-gold hover:text-white transition-all"
          >
            Explore All Services
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <AnimatePresence>
            {services.length > 0 ? (
              services.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-[32px] overflow-hidden shadow-xl shadow-saffron/5 border border-saffron/5 flex flex-col h-full"
                >
                  <div className="h-56 bg-slate-50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-saffron/10 to-gold/10 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center text-saffron/20">
                      <Sparkles size={72} strokeWidth={1} />
                    </div>
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur rounded-full px-4 py-1.5 text-[10px] font-black text-saffron uppercase tracking-[0.2em] shadow-sm">
                      {service.category}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h4 className="text-2xl font-bold mb-3 group-hover:text-saffron transition-colors">{service.name}</h4>
                    <p className="text-sm text-text-dark/50 mb-8 leading-relaxed flex-grow">{service.description}</p>
                    
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-warm-white bg-slate-50/50 p-4 rounded-2xl">
                      <div className="flex items-center gap-2 text-gold">
                        <Clock size={16} />
                        <span className="text-sm font-bold">{service.durationMins}m</span>
                      </div>
                      <div className="text-xl font-black text-text-dark">₹{service.basePrice}</div>
                    </div>

                    <button 
                      onClick={() => onBook(service)}
                      className="w-full bg-saffron text-white shadow-lg shadow-saffron/20 hover:shadow-xl hover:shadow-saffron/40 font-bold py-4 rounded-2xl transition-all"
                    >
                      Quick Book
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                <div className="text-4xl mb-4">🕉️</div>
                <h4 className="text-xl font-bold text-text-dark/40 italic">Wait while we connect it to Database. Select other options above meanwhile</h4>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Pandit Highlight */}
      <section className="bg-white py-32 relative overflow-hidden">
        <div className="absolute -left-20 top-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Experience Ancient Wisdom</h3>
            <p className="text-text-dark/50 max-w-2xl mx-auto text-lg leading-relaxed">Meet our verified exponents who bring millennia of authentic Vedic knowledge to your sacred ceremonies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {pandits.length > 0 ? (
              pandits.map((pandit) => (
                <div key={pandit.id} className="relative group">
                  <div className="absolute inset-0 bg-gold/5 rounded-[40px] translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform"></div>
                  <div className="relative bg-white p-10 rounded-[40px] shadow-xl border border-gold/10 text-center transition-all">
                    <div className="w-28 h-28 bg-warm-white rounded-full mx-auto mb-8 flex items-center justify-center text-gold border-4 border-gold/5 shadow-inner overflow-hidden text-4xl">
                      {pandit.photoUrl ? (
                        <img src={pandit.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        "🧘‍♂️"
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-gold mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} fill={i < Math.floor(parseFloat(pandit.rating || "0")) ? "currentColor" : "none"} />
                      ))}
                      <span className="text-sm font-black ml-2 bg-gold/10 px-2 py-0.5 rounded text-gold">{pandit.rating}</span>
                    </div>
                    <h4 className="text-2xl font-bold mb-2">{pandit.name}</h4>
                    <p className="text-saffron text-xs font-black uppercase tracking-[0.2em] mb-6">{pandit.experience}+ Years of Sadhana</p>
                    <p className="text-sm text-text-dark/60 mb-8 italic leading-relaxed">"{pandit.bio || 'Preserving the purity of Vedic traditions for your family\'s spiritual well-being.'}"</p>
                    <div className="flex items-center justify-center gap-3 py-3 px-6 bg-green-50 text-green-700 rounded-full text-xs font-bold w-fit mx-auto cursor-pointer" onClick={onFindPandit}>
                      <CheckCircle size={16} />
                      <span>KYC & Aadhaar Verified</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-gold/5 rounded-[2.5rem] border border-dashed border-gold/20">
                <p className="text-gold font-bold italic">Loading verified masters...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

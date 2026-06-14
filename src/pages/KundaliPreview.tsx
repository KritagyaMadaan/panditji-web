import React from "react";
import { motion } from "motion/react";
import { 
  Sun, 
  Moon, 
  Star, 
  Lock, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  User, 
  MapPin, 
  Calendar, 
  Clock,
  Sparkles,
  Heart,
  Briefcase,
  Activity,
  Gem
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils.ts";

const BirthChartSVG = () => (
  <svg viewBox="0 0 400 400" className="w-full h-full text-gold/30">
    <rect x="0" y="0" width="400" height="400" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="0" y1="0" x2="400" y2="400" stroke="currentColor" strokeWidth="2" />
    <line x1="400" y1="0" x2="0" y2="400" stroke="currentColor" strokeWidth="2" />
    <line x1="200" y1="0" x2="0" y2="200" stroke="currentColor" strokeWidth="2" />
    <line x1="400" y1="200" x2="200" y2="0" stroke="currentColor" strokeWidth="2" />
    <line x1="200" y1="400" x2="400" y2="200" stroke="currentColor" strokeWidth="2" />
    <line x1="0" y1="200" x2="200" y2="400" stroke="currentColor" strokeWidth="2" />
    {/* Mock Houses Labels */}
    <text x="190" y="40" fontSize="12" fill="currentColor" fontWeight="bold">1</text>
    <text x="80" y="80" fontSize="12" fill="currentColor" fontWeight="bold">2</text>
    <text x="40" y="190" fontSize="12" fill="currentColor" fontWeight="bold">3</text>
    <text x="80" y="320" fontSize="12" fill="currentColor" fontWeight="bold">4</text>
    <text x="190" y="380" fontSize="12" fill="currentColor" fontWeight="bold">5</text>
    <text x="320" y="320" fontSize="12" fill="currentColor" fontWeight="bold">6</text>
    <text x="360" y="190" fontSize="12" fill="currentColor" fontWeight="bold">7</text>
    <text x="320" y="80" fontSize="12" fill="currentColor" fontWeight="bold">8</text>
    <text x="190" y="140" fontSize="12" fill="currentColor" fontWeight="bold">9</text>
    <text x="140" y="190" fontSize="12" fill="currentColor" fontWeight="bold">10</text>
    <text x="190" y="260" fontSize="12" fill="currentColor" fontWeight="bold">11</text>
    <text x="260" y="190" fontSize="12" fill="currentColor" fontWeight="bold">12</text>
  </svg>
);

const lockedCards = [
  { id: "dasha", title: "Dasha Predictions", icon: <Activity size={24} /> },
  { id: "remedies", title: "Vedic Remedies", icon: <Gem size={24} /> },
  { id: "marriage", title: "Marriage Compatibility", icon: <Heart size={24} /> },
  { id: "career", title: "Career & Finance", icon: <Briefcase size={24} /> }
];

export default function KundaliPreview() {
  const userName = "Aditi Sharma"; // Mock
  const birthDetails = {
    date: "Dec 15, 1995",
    time: "10:45 AM",
    place: "New Delhi, India"
  };

  const scrollToUnlock = () => {
    document.getElementById('unlock-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-[#0A0A1F] text-white font-sans overflow-x-hidden pb-32">
      {/* Header Summary */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10 grayscale pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 lg:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold font-black text-[10px] uppercase tracking-widest mb-10"
          >
            <Sparkles size={14} /> Report Generated Successfully
          </motion.div>
          <h1 className="text-4xl lg:text-7xl font-black mb-8 leading-[0.9] tracking-tighter">
            Your Free <span className="text-gold italic">Kundali</span> Preview
          </h1>
          
          <div className="flex flex-wrap justify-center gap-6 lg:gap-12 mt-12 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] max-w-4xl mx-auto shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/10">
                <User size={20} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Name</div>
                <div className="text-sm font-black">{userName}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/10">
                <Calendar size={20} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Birth Date</div>
                <div className="text-sm font-black">{birthDetails.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/10">
                <Clock size={20} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Time</div>
                <div className="text-sm font-black">{birthDetails.time}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/10">
                <MapPin size={20} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Place</div>
                <div className="text-sm font-black">{birthDetails.place}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-5xl mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Locked Birth Chart */}
          <div id="unlock-section" className="lg:col-span-12 relative group">
             <div className="bg-white/5 rounded-[4rem] p-12 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                <div className="max-w-md mx-auto aspect-square p-12 blur-md transition-all group-hover:blur-[12px]">
                   <BirthChartSVG />
                </div>
                
                {/* Unlock Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A1F]/40 backdrop-blur-[6px] z-20">
                   <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-12 rounded-[4rem] flex flex-col items-center text-center shadow-3xl max-w-sm">
                      <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center text-[#0A0A1F] shadow-2xl shadow-gold/30 mb-8">
                         <Lock size={32} />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase tracking-[0.1em]">Unlock Full Report</h3>
                      <p className="text-white/60 text-sm font-medium mb-10 leading-relaxed italic">Get 40+ pages of deep astrological insights, remedies, and timeline predictions.</p>
                      <button className="w-full py-6 bg-gold text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-3xl shadow-gold/20 hover:scale-105 active:scale-95 transition-all">
                        Unlock Now — ₹499
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {/* Visible Free Preview */}
          <div className="lg:col-span-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-[4rem] p-12 border border-white/10 shadow-2xl relative overflow-hidden text-center lg:text-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-[5rem] -mr-8 -mt-8"></div>
              
              <div className="flex flex-col lg:flex-row items-center gap-16">
                 <div className="flex-1 space-y-12">
                    <div className="text-xs font-black text-gold uppercase tracking-[0.4em]">Primary Influence</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                       <div className="space-y-4">
                          <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-gold shadow-xl border border-white/10">
                             <Sun size={28} />
                          </div>
                          <div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Sun Sign</div>
                             <div className="text-xl font-black italic">Sagittarius</div>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-gold shadow-xl border border-white/10">
                             <Moon size={28} />
                          </div>
                          <div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Moon Sign</div>
                             <div className="text-xl font-black italic">Aries</div>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-gold shadow-xl border border-white/10">
                             <Star size={28} />
                          </div>
                          <div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Rising Sign</div>
                             <div className="text-xl font-black italic">Leo</div>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex-1 bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-inner">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gold mb-6 flex items-center gap-3">
                       <Zap size={14} /> Personality Snapshot
                    </div>
                    <p className="text-lg font-bold leading-relaxed italic text-white/80">
                      You possess a fiery spirit with a natural leadership aura. Your Sagittarius Sun brings a thirst for wisdom, while your Aries Moon provides the courage to chase your wildest dreams without hesitation.
                    </p>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Locked Content Grid */}
          <div className="lg:col-span-12">
             <div className="text-center mb-16">
                <h4 className="text-3xl font-black tracking-tighter italic">Deep Dive <span className="text-gold">Insights</span></h4>
                <p className="text-sm font-medium text-white/30 mt-4">These sections are available in the full report.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {lockedCards.map((card) => (
                   <motion.div
                    key={card.id}
                    onClick={scrollToUnlock}
                    whileHover={{ y: -10 }}
                    className="bg-white/5 rounded-[3rem] p-10 border border-white/10 relative overflow-hidden flex flex-col items-center text-center cursor-pointer group"
                   >
                      <div className="absolute inset-0 bg-white/5 backdrop-blur-[4px] z-10 flex flex-col items-center justify-center opacity-80 group-hover:opacity-100 transition-all">
                         <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold mb-4 border border-gold/30">
                            <Lock size={18} />
                         </div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-gold/60 group-hover:text-gold transition-colors">Locked Section</div>
                      </div>
                      
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 mb-6 border border-white/5 relative z-0">
                         {card.icon}
                      </div>
                      <h5 className="text-xl font-black tracking-tight relative z-0">{card.title}</h5>
                   </motion.div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Trust Markers */}
      <section className="py-24 max-w-7xl mx-auto px-4 text-center">
         <div className="flex flex-wrap justify-center items-center gap-12 font-black text-[10px] uppercase tracking-[0.4em] text-white/20">
            <div className="flex items-center gap-3"><ShieldCheck size={18} className="text-gold/40" /> 100% Secure</div>
            <div className="flex items-center gap-3"><ShieldCheck size={18} className="text-gold/40" /> AI-Verified Vedic Accuracy</div>
            <div className="flex items-center gap-3"><ShieldCheck size={18} className="text-gold/40" /> Confidential Data</div>
         </div>
      </section>

      {/* Sticky Bottom Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden p-4 bg-[#0A0A1F]/80 backdrop-blur-xl border-t border-white/10 shadow-3xl">
         <div className="flex items-center justify-between gap-4">
            <div>
               <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Full Kundali Report</div>
               <div className="text-xl font-black text-gold">₹499 <span className="text-[10px] line-through text-white/20 ml-2">₹1,999</span></div>
            </div>
            <button className="flex-grow max-w-[200px] py-4 bg-gold text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-gold/20 flex items-center justify-center gap-2">
               Unlock Now <ArrowRight size={14} />
            </button>
         </div>
      </div>

      {/* Desktop Floating Unlock Button (Optional) */}
      <div className="hidden lg:block fixed bottom-12 right-12 z-[100]">
         <motion.button 
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gold text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(212,175,55,0.4)] flex items-center gap-4 border border-white/20"
         >
            Get Full Report — ₹499
            <Lock size={16} />
         </motion.button>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Info, 
  Calendar as CalendarIcon,
  Moon,
  Sun,
  Zap,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils.ts";

const occasions = [
  "Marriage",
  "Griha Pravesh",
  "Mundan",
  "Naamkaran",
  "Business Launch"
];

interface MuhuratDetail {
  tithi: string;
  nakshatra: string;
  yoga: string;
  window: string;
  significance: string;
}

// Mock auspicious dates for June 2026 (based on local time metadata)
const auspiciousDatesData: Record<string, MuhuratDetail> = {
  "2026-06-05": {
    tithi: "Shashti",
    nakshatra: "Rohini",
    yoga: "Siddhi Yoga",
    window: "08:15 AM – 10:30 AM",
    significance: "Highly auspicious for long-term unions and prosperity."
  },
  "2026-06-12": {
    tithi: "Ekadashi",
    nakshatra: "Pushya",
    yoga: "Vridhhi Yoga",
    window: "11:45 AM – 01:20 PM",
    significance: "Excellent for new beginnings and spiritual growth."
  },
  "2026-06-18": {
    tithi: "Chaturthi",
    nakshatra: "Uttara Phalguni",
    yoga: "Shiva Yoga",
    window: "06:30 AM – 08:45 AM",
    significance: "Brings stability and social standing to the union."
  },
  "2026-06-25": {
    tithi: "Dashami",
    nakshatra: "Swati",
    yoga: "Subha Yoga",
    window: "10:30 AM – 12:45 PM",
    significance: "Ideal for travel-related ventures and dynamic growth."
  }
};

export default function MuhuratCalculator() {
  const [selectedOccasion, setSelectedOccasion] = useState("Marriage");
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1)); // June 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const calendarDays = useMemo(() => {
    const days = [];
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Padding for start of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
       const dateStr = `2026-06-${i.toString().padStart(2, '0')}`;
       days.push({
         day: i,
         dateStr,
         isAuspicious: !!auspiciousDatesData[dateStr]
       });
    }
    return days;
  }, [currentMonth]);

  const selectedDetail = selectedDate ? auspiciousDatesData[selectedDate] : null;

  return (
    <div className="min-h-screen bg-[#FFFDF5] pb-24 pt-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold font-black text-[10px] uppercase tracking-widest mb-6">
            <Sparkles size={14} /> Vedic Astrology Tools
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-text-dark tracking-tighter mb-6">Find Your Auspicious Date</h1>
          <p className="text-lg text-text-dark/40 font-medium max-w-xl mx-auto leading-relaxed">
            Discover the perfect cosmic window for your sacred milestones using our traditional Muhurat calculation engine.
          </p>
        </div>

        {/* Occasion Selector */}
        <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gold/5 border border-gold/5 mb-10 overflow-hidden relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="text-left w-full md:w-auto">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/20 block mb-3">Select Occasion</label>
              <div className="flex flex-wrap gap-3">
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(occ)}
                    className={cn(
                      "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                      selectedOccasion === occ 
                        ? "bg-gold text-white border-gold shadow-lg shadow-gold/20" 
                        : "bg-slate-50 text-text-dark/40 border-transparent hover:border-gold/20"
                    )}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-3xl border border-slate-100">
               <button className="p-3 bg-white rounded-xl shadow-sm text-gold hover:scale-110 transition-transform">
                 <ChevronLeft size={20} />
               </button>
               <div className="text-sm font-black uppercase tracking-widest text-text-dark">
                 {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
               </div>
               <button className="p-3 bg-white rounded-xl shadow-sm text-gold hover:scale-110 transition-transform">
                 <ChevronRight size={20} />
               </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-gold/5 border border-gold/5 mb-10 overflow-hidden relative">
          <div className="grid grid-cols-7 mb-8">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(h => (
              <div key={h} className="text-center text-[10px] font-black text-text-dark/20 tracking-widest">{h}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-4">
            {calendarDays.map((date, idx) => (
              <div key={idx} className="aspect-square relative">
                {date && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => date.isAuspicious && setSelectedDate(date.dateStr)}
                    className={cn(
                      "w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all relative group",
                      date.isAuspicious 
                        ? "bg-gold/10 border-2 border-gold/20 text-gold shadow-xl shadow-gold/5" 
                        : "hover:bg-slate-50 text-text-dark/40",
                      selectedDate === date.dateStr ? "ring-4 ring-gold/20 scale-105" : ""
                    )}
                  >
                    <span className="text-sm font-black">{date.day}</span>
                    {date.isAuspicious && (
                      <Star size={10} fill="currentColor" className="mt-1 animate-pulse" />
                    )}
                    {date.isAuspicious && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full border-2 border-white shadow-sm"></div>
                    )}
                  </motion.button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Detail Card */}
        <AnimatePresence mode="wait">
          {selectedDetail ? (
            <motion.div
              key={selectedDate}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gold p-10 md:p-12 rounded-[3.5rem] shadow-2xl shadow-gold/20 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-bl-full pointer-events-none -mr-32 -mt-32 backdrop-blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 pb-8 border-b border-white/10">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-4xl shadow-sm border border-white/20">
                         ✨
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Auspicious Date Detail</div>
                        <h2 className="text-3xl font-black italic">June {selectedDate?.split('-')[2]}, 2026</h2>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 bg-white/20 px-6 py-3 rounded-full border border-white/20 backdrop-blur-md">
                      <Zap size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{selectedOccasion} Muhurat</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mb-10">
                   <div className="space-y-8">
                      <div className="flex items-center gap-6 group">
                         <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20 transition-all group-hover:bg-white group-hover:text-gold">
                            <Moon size={20} />
                         </div>
                         <div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Tithi / Nakshatra</div>
                            <div className="font-black text-lg">{selectedDetail.tithi} / {selectedDetail.nakshatra}</div>
                         </div>
                      </div>
                      <div className="flex items-center gap-6 group">
                         <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20 transition-all group-hover:bg-white group-hover:text-gold">
                            <Sun size={20} />
                         </div>
                         <div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Auspicous Time Widow</div>
                            <div className="font-black text-lg">{selectedDetail.window}</div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 flex items-start gap-4">
                      <Info className="shrink-0 mt-1" size={20} />
                      <div>
                         <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Astro Significance</div>
                         <p className="text-sm font-bold leading-relaxed">{selectedDetail.significance}</p>
                      </div>
                   </div>
                </div>

                <Link 
                  to="/book"
                  className="w-full py-5 bg-white text-gold rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-50 transition-all"
                >
                  Confirm Muhurat with Pandit Ji
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-20 px-8 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <CalendarIcon size={32} />
               </div>
               <h3 className="text-xl font-bold text-text-dark/40 italic">Select a highlighted date with <Star className="inline mb-1" size={16} /> to see details</h3>
            </div>
          )}
        </AnimatePresence>

        {/* Support CTA */}
        <section className="mt-20">
           <div className="bg-text-dark rounded-[3.5rem] p-12 md:p-16 text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10 pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-gold/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
              
              <div className="relative z-10">
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center text-gold shadow-2xl shadow-gold/20">
                    <Sparkles size={32} />
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">Need expert verification?</h3>
                <p className="text-white/40 text-lg font-medium max-w-xl mx-auto mb-10 leading-relaxed">
                  Every family has unique astrological blueprints. Ensure your chosen date aligns perfectly with your individual horoscopes.
                </p>
                <Link to="/book" className="inline-flex items-center gap-4 px-12 py-5 bg-gold text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-gold/30 hover:scale-105 transition-all">
                   Consult a Trusted Pandit ji
                   <ArrowRight size={18} />
                </Link>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}

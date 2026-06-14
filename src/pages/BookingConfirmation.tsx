import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Calendar, Share2, ArrowRight, Home, Phone } from "lucide-react";

export default function BookingConfirmation() {
  const location = useLocation();
  const bookingState = location.state || {};
  
  const currentYear = new Date().getFullYear();
  const bookingId = "#BPJ-" + currentYear + "-0847";
  
  // Format the date if provided, otherwise default to current year
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return `Oct 24, ${currentYear} at 11:00 AM`;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ` at ${bookingState.time || "11:00 AM"}`;
  };

  const dateStr = formatDate(bookingState.date);

  return (
    <div className="min-h-screen bg-slate-50/30 flex items-center justify-center py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl shadow-saffron/10 border border-saffron/5 p-12 text-center"
      >
        <div className="relative mb-10">
           <motion.div
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
             className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white shadow-xl shadow-green-500/30"
           >
              <CheckCircle size={48} />
           </motion.div>
           {/* Celebration particles could go here */}
        </div>

        <h1 className="text-4xl font-black text-text-dark mb-4 tracking-tight">Booking Confirmed!</h1>
        <p className="text-text-dark/40 font-bold mb-10">Your spiritual journey is now scheduled. A confirmation email and SMS has been sent to your registered mobile.</p>

        <div className="bg-slate-50 rounded-3xl p-8 space-y-6 mb-12 border border-slate-100 text-left">
           <div className="flex justify-between items-center pb-6 border-b border-dashed border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Booking ID</span>
              <span className="text-lg font-black text-text-dark">{bookingId}</span>
           </div>
           
           <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-saffron/10 rounded-xl flex items-center justify-center text-saffron">
                    <Calendar size={20} />
                 </div>
                 <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Schedule</div>
                    <div className="text-sm font-bold text-text-dark">{dateStr}</div>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600">
                    <Phone size={20} />
                 </div>
                 <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Pandit Contact</div>
                    <div className="text-sm font-bold text-text-dark">98765-XXXXX <span className="text-[10px] text-green-600 ml-2">(Masked until 2hr prior)</span></div>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
           <button className="py-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-text-dark hover:bg-slate-100 transition-all">
              <Calendar size={16} className="text-saffron" />
              Add to Calendar
           </button>
           <button className="py-4 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-green-700 hover:bg-green-100 transition-all">
              <Share2 size={16} />
              Share on WhatsApp
           </button>
        </div>

        <Link 
          to="/"
          className="inline-flex items-center gap-3 text-saffron font-black text-xs uppercase tracking-[0.2em] hover:gap-5 transition-all"
        >
          <Home size={16} />
          Back to Home
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  );
}

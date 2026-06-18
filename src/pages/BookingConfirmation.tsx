import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Calendar, Share2, ArrowRight, Home, Phone, Sparkles, User } from "lucide-react";

export default function BookingConfirmation() {
  const location = useLocation();
  const bookingState = location.state || {};
  
  const currentYear = new Date().getFullYear();
  const rawBookingId = bookingState.bookingId;
  const bookingId = rawBookingId ? `BPJ-${rawBookingId.slice(0, 8).toUpperCase()}` : `#BPJ-${currentYear}-0847`;
  
  // Format the date if provided
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return `Oct 24, ${currentYear} at 11:00 AM`;
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ` at ${bookingState.time || "11:00 AM"}`;
  };

  const dateStr = formatDate(bookingState.date);
  const serviceName = bookingState.service || "Vedic Puja";
  const panditName = bookingState.panditName || "Acharya";
  const totalAmount = bookingState.total || 0;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl shadow-primary/5 border border-primary/10 p-8 md:p-12 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary to-[#ff6b00]" />
        
        <div className="relative mb-8">
           <motion.div
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
             className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white shadow-xl shadow-green-500/25"
           >
              <CheckCircle size={40} />
           </motion.div>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-on-surface mb-3 tracking-tight">Booking Confirmed!</h1>
        <p className="text-on-surface-variant font-bold text-sm mb-8">
          Your spiritual journey is now scheduled. A confirmation email and SMS have been sent to your registered contact.
        </p>

        <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 space-y-5 mb-8 text-left">
           <div className="flex justify-between items-center pb-4 border-b border-dashed border-outline-variant/40">
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Booking Reference</span>
              <span className="text-base font-black text-on-surface select-all">{bookingId}</span>
           </div>
           
           <div className="space-y-4">
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Sparkles size={18} />
                 </div>
                 <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Puja & Ritual</div>
                    <div className="text-sm font-bold text-on-surface">{serviceName}</div>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <User size={18} />
                 </div>
                 <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Assigned Acharya</div>
                    <div className="text-sm font-bold text-on-surface">{panditName}</div>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Calendar size={18} />
                 </div>
                 <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Schedule</div>
                    <div className="text-sm font-bold text-on-surface">{dateStr}</div>
                 </div>
              </div>

              {totalAmount > 0 && (
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                       <span className="material-symbols-outlined text-[18px]">payments</span>
                    </div>
                    <div>
                       <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Dakshina Transferred</div>
                       <div className="text-sm font-bold text-on-surface">₹{totalAmount.toLocaleString()}</div>
                    </div>
                 </div>
              )}

              <div className="flex items-start gap-4 pt-1">
                 <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                    <Phone size={18} />
                 </div>
                 <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Acharya Contact</div>
                    <div className="text-sm font-bold text-on-surface">
                       +91 98765-XXXXX <span className="text-[10px] text-green-600 block sm:inline font-medium sm:ml-2">(Available 2 hours before ritual)</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
           <button className="py-4 bg-white border border-outline-variant/40 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-on-surface hover:bg-surface transition-all">
              <Calendar size={14} className="text-primary" />
              Add to Calendar
           </button>
           <button className="py-4 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-green-700 hover:bg-green-100 transition-all">
              <Share2 size={14} />
              Share details
           </button>
        </div>

        <Link 
          to="/"
          className="inline-flex items-center gap-3 text-primary font-black text-xs uppercase tracking-[0.2em] hover:gap-5 transition-all"
        >
          <Home size={14} />
          Back to Home
          <ArrowRight size={14} />
        </Link>
      </motion.div>
    </div>
  );
}

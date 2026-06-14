import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  AlertCircle, 
  ArrowLeft, 
  Star,
  ShieldCheck,
  CreditCard,
  Hash
} from "lucide-react";
import { cn } from "../lib/utils.ts";

type BookingStatus = "Confirmed" | "Pandit En Route" | "Pandit Arrived" | "Ceremony in Progress" | "Completed";

const statusSteps: BookingStatus[] = [
  "Confirmed",
  "Pandit En Route",
  "Pandit Arrived",
  "Ceremony in Progress",
  "Completed"
];

// Mock data fetcher
const getBookingData = (id: string) => {
  const currentYear = new Date().getFullYear();
  return {
    id: id || `BPJ-${currentYear}-0847`,
    serviceName: "Griha Pravesh Puja",
    date: `Oct 24, ${currentYear}`,
    time: "11:00 AM",
    address: "H-24, Green Park Extension, New Delhi - 110016",
    amount: 6273,
    status: "Pandit En Route" as BookingStatus,
    pandit: {
      name: "Pt. Rajesh Shastri",
      photo: "🧘‍♂️",
      rating: 4.95,
      phone: "98XXXXX210"
    }
  };
};

export default function BookingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(getBookingData(id || ""));
  
  // Find current step index
  const currentStepIndex = statusSteps.indexOf(booking.status);

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20 pt-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back Button */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-dark/30 hover:text-saffron transition-all mb-8"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Top Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-saffron/5 border border-saffron/5 mb-10 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/5 rounded-bl-[5rem] -mr-8 -mt-8 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-saffron/10 rounded-full text-saffron text-[10px] font-black uppercase tracking-widest">
                 <ShieldCheck size={12} /> Secure Booking
              </div>
              <h1 className="text-3xl font-black text-text-dark tracking-tight">{booking.serviceName}</h1>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-text-dark/40 font-bold text-sm">
                   <Calendar size={16} /> {booking.date}
                </div>
                <div className="flex items-center gap-2 text-text-dark/40 font-bold text-sm">
                   <Clock size={16} /> {booking.time}
                </div>
              </div>
              <div className="flex items-start gap-2 text-text-dark/40 font-bold text-sm max-w-md">
                 <MapPin size={16} className="shrink-0 mt-0.5" /> {booking.address}
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center min-w-[160px]">
               <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/30 mb-1">Amount Paid</div>
               <div className="text-3xl font-black text-saffron">₹{booking.amount.toLocaleString()}</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Status Timeline */}
          <div className="lg:col-span-12">
            <h2 className="text-xl font-black text-text-dark mb-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-saffron flex items-center justify-center text-white shadow-lg shadow-saffron/20">
                <Hash size={16} />
              </div>
              Live Status Timeline
            </h2>
            
            <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-xl shadow-saffron/5 border border-saffron/5">
              <div className="relative space-y-12">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-slate-100"></div>
                
                {statusSteps.map((step, idx) => {
                  const isCompleted = idx < currentStepIndex;
                  const isActive = idx === currentStepIndex;
                  const isFuture = idx > currentStepIndex;

                  return (
                    <div key={step} className="relative flex items-start gap-10 group">
                      {/* Step Indicator */}
                      <div className="relative z-10">
                        {isCompleted ? (
                          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                            <CheckCircle size={20} />
                          </div>
                        ) : isActive ? (
                          <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center text-white shadow-xl shadow-saffron/30 scale-110">
                            <span className="flex h-3 w-3 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-slate-300">
                             <div className="w-2 h-2 rounded-full bg-current"></div>
                          </div>
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 pt-1">
                        <div className={cn(
                          "text-sm font-black uppercase tracking-widest transition-all",
                          isActive ? "text-saffron scale-105 origin-left" : 
                          isCompleted ? "text-green-600" : "text-text-dark/20"
                        )}>
                          {step}
                        </div>
                        {isActive && (
                          <p className="text-xs font-bold text-text-dark/40 mt-1">Our agent is on the way to your location.</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pandit Card */}
          <div className="lg:col-span-12">
             <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-saffron/5 border border-saffron/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                   <div className="w-24 h-24 bg-saffron/5 rounded-full flex items-center justify-center text-5xl border-2 border-saffron/10 shadow-inner">
                      {booking.pandit.photo}
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-saffron">Assigned Pandit</div>
                      <h3 className="text-2xl font-black text-text-dark">{booking.pandit.name}</h3>
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5 text-gold text-sm font-black">
                            <Star size={14} fill="currentColor" /> {booking.pandit.rating}
                         </div>
                         <div className="text-xs font-bold text-text-dark/40">{booking.pandit.phone}</div>
                      </div>
                   </div>
                </div>
                <button className="w-full md:w-auto px-10 py-5 bg-saffron text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-saffron/30 hover:bg-text-dark transition-all flex items-center justify-center gap-3">
                   <Phone size={18} />
                   Call Pandit
                </button>
             </div>
          </div>

          {/* Detailed Info */}
          <div className="lg:col-span-12">
             <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-xl shadow-saffron/5 border border-saffron/5">
                <h3 className="text-lg font-black text-text-dark mb-8 uppercase tracking-widest">Ritual Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Service Requested</div>
                      <div className="text-sm font-bold text-text-dark">{booking.serviceName}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Scheduled Date & Time</div>
                      <div className="text-sm font-bold text-text-dark">{booking.date} at {booking.time}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Ceremony Address</div>
                      <div className="text-sm font-bold text-text-dark leading-relaxed">{booking.address}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Payment Info</div>
                      <div className="flex items-center gap-2 text-sm font-bold text-text-dark">
                         <CreditCard size={14} className="text-saffron" /> Paid Online
                      </div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-text-dark/30">Booking ID</div>
                      <div className="text-sm font-bold text-text-dark font-mono bg-slate-50 px-3 py-1 rounded-lg inline-block">{booking.id}</div>
                   </div>
                </div>

                {booking.status === "Confirmed" && (
                  <div className="mt-12 pt-10 border-t border-slate-50 flex flex-col items-center gap-4">
                     <button className="px-8 py-3 rounded-xl border-2 border-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                        Cancel Booking
                     </button>
                     <p className="text-[10px] text-text-dark/20 font-bold uppercase tracking-widest">Cancellation Fee of ₹500 applicable after confirmed</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Support Footer */}
        <div className="mt-12 text-center p-10 bg-text-dark rounded-[2.5rem] shadow-2xl">
           <div className="w-12 h-12 bg-saffron/20 text-saffron rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={24} />
           </div>
           <h4 className="text-xl font-bold text-white mb-2">Facing an issue?</h4>
           <p className="text-white/40 text-sm font-medium mb-8">Our dedicated support team is here to help you 24/7.</p>
           <button className="text-saffron font-black text-[10px] uppercase tracking-widest hover:tracking-[0.2em] transition-all">
              Contact Support Agent
           </button>
        </div>
      </div>
    </div>
  );
}

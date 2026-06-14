import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  DollarSign, 
  Navigation, 
  Bell, 
  Timer,
  Calendar,
  Check
} from "lucide-react";
import { cn } from "../lib/utils.ts";

interface Request {
  id: string;
  service: string;
  customer: string;
  time: string;
  expiresIn: number; // seconds
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

const initialRequests: Request[] = [
  {
    id: "req-1",
    service: "Griha Pravesh",
    customer: "Amit Bansal",
    time: "Today, 4:00 PM",
    expiresIn: 1800, // 30 mins
    status: 'pending'
  },
  {
    id: "req-2",
    service: "Satyanarayan Katha",
    customer: "Priya Singh",
    time: "Tomorrow, 10:00 AM",
    expiresIn: 1200, // 20 mins
    status: 'pending'
  }
];

const initialSchedule = [
  {
    id: "sch-1",
    time: "10:30 AM",
    service: "Mundan Sanskar",
    customer: "Deepak Sharma",
    address: "Block C, Sector 45, Gurugram..."
  },
  {
    id: "sch-2",
    time: "01:00 PM",
    service: "Vehicle Puja",
    customer: "Rajesh Khanna",
    address: "DLF Phase 3, Cyber City..."
  }
];

type BookingStatus = 'assigned' | 'en_route' | 'arrived' | 'started' | 'completed';

// Component definitions at top to avoid reference errors
const User = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function PanditDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [activeBookingStatus, setActiveBookingStatus] = useState<BookingStatus>('en_route');
  
  // Countdown Timer for Requests
  useEffect(() => {
    const interval = setInterval(() => {
      setRequests(prev => prev.map(req => {
        if (req.status === 'pending' && req.expiresIn > 0) {
          return { ...req, expiresIn: req.expiresIn - 1 };
        }
        if (req.status === 'pending' && req.expiresIn <= 0) {
          return { ...req, status: 'expired' };
        }
        return req;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRequest = (id: string, action: 'accepted' | 'declined') => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: action } : req
    ));
  };

  const statusOrder: BookingStatus[] = ['en_route', 'arrived', 'started', 'completed'];
  const statusLabels: Record<BookingStatus, string> = {
    'assigned': 'Assigned',
    'en_route': 'En Route',
    'arrived': 'Arrived',
    'started': 'Start Ceremony',
    'completed': 'Complete'
  };

  const currentStatusIndex = statusOrder.indexOf(activeBookingStatus);

  return (
    <div className="min-h-screen bg-[#F8FAF9] pb-32">
      {/* Top Header */}
      <header className="bg-white border-b border-emerald-100 px-6 py-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">ॐ</div>
          <div>
            <h1 className="text-xl font-black text-text-dark tracking-tighter">Namaste, Pandit Ji</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-text-dark/20">Sunday, June 14, 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden sm:flex flex-col items-end mr-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-dark/20 mb-1">Status</span>
              <span className={cn("text-xs font-bold", isAvailable ? "text-emerald-600" : "text-slate-400")}>
                {isAvailable ? "Available to Accept" : "Offline"}
              </span>
           </div>
           <button 
            onClick={() => setIsAvailable(!isAvailable)}
            className={cn(
              "w-14 h-8 rounded-full p-1 transition-all duration-500",
              isAvailable ? "bg-emerald-600" : "bg-slate-200"
            )}
           >
              <div className={cn(
                "w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-500",
                isAvailable ? "translate-x-6" : "translate-x-0"
              )} />
           </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-12">
        
        {/* Active Booking Section */}
        <section>
           <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/20 mb-6 px-2 flex items-center gap-2">
              <Bell size={14} className="text-emerald-600" /> Currently Active
           </div>
           <div className="bg-emerald-600 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-bl-full pointer-events-none -mr-20 -mt-20 backdrop-blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
                   <div className="space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Session in progress</div>
                      <h2 className="text-3xl font-black italic">Satyanarayan Katha</h2>
                      <div className="flex items-center gap-3 text-sm font-bold opacity-80 mt-2">
                         <MapPin size={16} /> 24, Hemkund Towers, Nehru Place...
                      </div>
                   </div>
                   <button className="bg-white/20 backdrop-blur-xl px-6 py-4 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest border border-white/20 hover:bg-white hover:text-emerald-600 transition-all">
                      <Navigation size={16} /> Navigate
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   {statusOrder.map((status, idx) => (
                      <button
                        key={status}
                        disabled={idx > currentStatusIndex + 1 || activeBookingStatus === 'completed'}
                        onClick={() => setActiveBookingStatus(status)}
                        className={cn(
                          "py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all relative overflow-hidden flex flex-col items-center justify-center gap-2",
                          idx < currentStatusIndex ? "bg-white/10 text-white/40 cursor-default" : 
                          idx === currentStatusIndex ? "bg-white text-emerald-600 shadow-xl" :
                          idx === currentStatusIndex + 1 ? "bg-emerald-700/50 text-white border border-white/10 hover:bg-emerald-700" :
                          "bg-transparent text-white/30 border border-white/5 opacity-50 cursor-not-allowed"
                        )}
                      >
                         {idx < currentStatusIndex && <Check size={14} />}
                         {statusLabels[status]}
                      </button>
                   ))}
                </div>
              </div>
           </div>
        </section>

        {/* Requests Section */}
        <section>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/20 mb-6 px-2">
             New Requests (Accept within 30m)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div 
                  key={req.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={cn(
                    "bg-white rounded-[2.5rem] p-8 shadow-xl shadow-emerald-900/5 border border-emerald-50 transition-all relative overflow-hidden",
                    req.status !== 'pending' ? "opacity-60 grayscale" : ""
                  )}
                >
                   <div className="flex items-start justify-between mb-8">
                      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black">
                         {req.service[0]}
                      </div>
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic",
                        req.status === 'expired' ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"
                      )}>
                        <Timer size={12} /> {req.status === 'expired' ? "EXPIRED" : formatTime(req.expiresIn)}
                      </div>
                   </div>

                   <div className="mb-10">
                      <h4 className="text-xl font-black tracking-tight mb-2">{req.service}</h4>
                      <p className="text-sm font-bold text-text-dark/40 mb-4">{req.customer}</p>
                      <div className="flex items-center gap-2 text-xs font-black text-emerald-600/60 uppercase tracking-widest">
                         <Clock size={14} /> {req.time}
                      </div>
                   </div>

                   {req.status === 'pending' ? (
                     <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleRequest(req.id, 'accepted')}
                          className="py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                        >
                           Accept
                        </button>
                        <button 
                           onClick={() => handleRequest(req.id, 'declined')}
                           className="py-4 bg-white text-red-500 border border-red-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all"
                        >
                           Decline
                        </button>
                     </div>
                   ) : (
                     <div className="py-4 text-center font-black text-[10px] uppercase tracking-[0.2em] text-text-dark/20 italic">
                        Request {req.status === 'accepted' ? 'Accepted' : req.status === 'declined' ? 'Declined' : 'Expired'}
                     </div>
                   )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Schedule Section */}
          <section>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/20 mb-6 px-2">
              Today's Schedule
            </div>
            <div className="space-y-6">
               {initialSchedule.map((item) => (
                 <div key={item.id} className="bg-white rounded-3xl p-8 shadow-lg shadow-emerald-900/5 border border-emerald-50 relative group">
                    <div className="flex items-start justify-between gap-6">
                       <div className="space-y-6">
                          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">
                             {item.time}
                          </div>
                          <div>
                             <h5 className="font-black text-lg mb-1">{item.service}</h5>
                             <p className="text-xs font-bold text-text-dark/40 mb-4">{item.customer}</p>
                             <div className="flex items-start gap-2 text-[10px] font-bold text-text-dark/30 leading-relaxed max-w-[200px]">
                                <MapPin size={12} className="shrink-0 mt-0.5" /> {item.address}
                             </div>
                          </div>
                       </div>
                       <button className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-text-dark/20 hover:bg-emerald-600 hover:text-white transition-all group-hover:scale-110">
                          <Navigation size={20} />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          </section>

          {/* Earnings Statistics */}
          <section>
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dark/20 mb-6 px-2">
                Earnings Stats
             </div>
             <div className="bg-white rounded-[3rem] p-10 border border-emerald-100 shadow-2xl shadow-emerald-900/5">
                <div className="text-center mb-10">
                   <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Wallet Balance</div>
                   <div className="text-5xl font-black italic tracking-tighter">₹12,450</div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-dashed border-emerald-100 transition-all hover:bg-emerald-50">
                      <div>
                         <div className="text-[9px] font-black uppercase tracking-widest text-text-dark/30 mb-1">This Week</div>
                         <div className="text-xl font-black">₹4,200</div>
                      </div>
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                         <DollarSign size={18} />
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-dashed border-emerald-100 transition-all hover:bg-emerald-50">
                      <div>
                         <div className="text-[9px] font-black uppercase tracking-widest text-text-dark/30 mb-1">This Month</div>
                         <div className="text-xl font-black">₹18,500</div>
                      </div>
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                         <Calendar size={18} />
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-6 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-600/20 text-white">
                      <div>
                         <div className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Pending Payout</div>
                         <div className="text-xl font-black italic">₹8,100</div>
                      </div>
                      <ArrowRight size={20} className="opacity-40" />
                   </div>
                </div>
                
                <button className="w-full mt-8 py-5 border-2 border-emerald-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all">
                   View Detailed Report
                </button>
             </div>
          </section>
        </div>
      </main>

      {/* Quick Action Navigation Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-emerald-100 p-4 px-8">
         <div className="max-w-md mx-auto flex items-center justify-between">
            <button className="flex flex-col items-center gap-1 text-emerald-600 font-black">
               <CheckCircle2 size={24} />
               <span className="text-[9px] uppercase tracking-widest">Duty</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-text-dark/20 font-black hover:text-emerald-600 transition-colors">
               <Calendar size={24} />
               <span className="text-[9px] uppercase tracking-widest">Calendar</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-text-dark/20 font-black hover:text-emerald-600 transition-colors">
               <DollarSign size={24} />
               <span className="text-[9px] uppercase tracking-widest">Payments</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-text-dark/20 font-black hover:text-emerald-600 transition-colors">
               <User size={24} />
               <span className="text-[9px] uppercase tracking-widest">Profile</span>
            </button>
         </div>
      </footer>
    </div>
  );
}


